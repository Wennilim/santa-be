import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SendWishlistService } from 'src/send-wishlist/send-wishlist.service';
import { activationEmailTemplate } from 'src/mail/templates/activation.template';

import { Department, Gender } from 'src/constants/user';
import { receiveOTP } from 'src/mail/templates/receiveOTP.template';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>, // 操作用户表
    private mailerService: MailerService, // 发送邮件
    private jwtService: JwtService, // 👈 注入 JwtService
    private configService: ConfigService, // 👈 注入 ConfigService
    @Inject(forwardRef(() => SendWishlistService))
    private readonly sendWishlistService: SendWishlistService,
  ) {}

  async register(dto: {
    fullname: string;
    email: string;
    password: string;
    department: Department;
    gender: Gender;
  }) {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    if (dto.email === adminUsername) {
      throw new BadRequestException('Email already in use');
    }

    const exists = await this.userRepo.existsBy({ email: dto.email });
    if (exists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword: string = await bcrypt.hash(dto.password, 10);
    const token = uuidv4(); // 生成一个唯一的 verificationToken，用于用户邮箱验证。

    // 创建用户对象并存数据库
    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      verificationToken: token,
      isVerified: false,
    });

    await this.userRepo.save(user);

    // 发送邮件
    const backendUrl =
      this.configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
    const url = `${backendUrl}/auth/verify?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: '🎄 Activate Your Santa Workshop Account',
        html: activationEmailTemplate(url),
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    return {
      message:
        'Registration successful. Please check your email to activate account.',
    };
  }

  async verifyToken(token: string) {
    const user = await this.userRepo.findOneBy({ verificationToken: token });
    if (!user) return null;

    user.isVerified = true;
    user.verificationToken = null;
    return await this.userRepo.save(user);
  }

  async login(dto: { email: string; password: string }) {
    // 0. Check for Hardcoded Admin
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (
      dto.email.trim().toLowerCase() === adminUsername?.trim().toLowerCase() &&
      dto.password === adminPassword
    ) {
      const payload = { sub: 0, username: adminUsername, role: 'admin' };
      return {
        access_token: await this.jwtService.signAsync(payload),
        user: {
          id: 0,
          fullname: 'Admin',
          gender: 'female',
          department: 'Operation',
          role: 'admin',
        },
      };
    }

    // 1. 查找用户 (显式包含 password 用于校验)
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: [
        'id',
        'email',
        'password',
        'isVerified',
        'fullname',
        'gender',
        'department',
      ],
    });
    if (!user) throw new NotFoundException('Invalid email or password');

    // 2. 检查是否激活 (你的需求核心)
    if (!user.isVerified) {
      throw new ForbiddenException(
        'Please verify your email before logging in.',
      );
    }

    // 3. 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new NotFoundException('Invalid email or password');

    // 4. 生成 JWT Payload
    const payload = {
      sub: user.id,
      email: user.email,
      dept: user.department,
      role: 'user',
    };

    // 5. 返回 Access Token 和用户信息
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        fullname: user.fullname,
        gender: user.gender,
        department: user.department,
      },
    };
  }

  async forgotPassword(dto: { email: string }) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);

    user.otp = otp;
    user.otpExpiresAt = expires;

    await this.userRepo.save(user);

    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Reset your password',
      html: receiveOTP(otp),
    });

    return {
      message: 'OTP sent to your email',
    };
  }

  async verifyOTP(dto: { email: string; otp: string }) {
    const { email, otp } = dto;

    const user = await this.userRepo.findOne({
      where: { email: email.trim().toLowerCase() },
      select: ['id', 'email', 'otp', 'otpExpiresAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1️⃣ 检查 OTP
    if (!user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // 2️⃣ 检查 OTP 是否过期
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    return {
      message: 'OTP verified successfully',
    };
  }

  async resetPassword(dto: {
    email: string;
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    const { email, otp, newPassword, confirmNewPassword } = dto;

    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'otp', 'otpExpiresAt', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1️⃣ 检查 OTP
    if (!user.otp || user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // 2️⃣ 检查 OTP 是否过期
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    // 3️⃣ 检查 password match
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // 4️⃣ hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // 5️⃣ 清除 OTP
    user.otp = null;
    user.otpExpiresAt = null;

    await this.userRepo.save(user);

    return {
      message: 'Password reset successfully',
    };
  }

  async seedUsers() {
    const defaultPassword = 'Password123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const departments = Object.values(Department);
    const mockWishlists = [
      [
        {
          wish: 'Chengdu Round Ticket',
          link: 'https://www.malaysiaairlines.com/my/en/home.html',
        },
        { wish: 'Mr PA Blind Box', link: 'https://www.kikagoods.com' },
      ],
      [
        {
          wish: 'Proton Emas 7 PHEV',
          link: 'https://localhost:3000/proton.com/',
        },
      ],
      [
        { wish: 'Mechanical Keyboard', link: '#' },
        { wish: 'Coffee Beans', link: '#' },
        { wish: 'Cozy Blanket', link: '#' },
      ],
    ];

    const usersToSeed: User[] = [];

    for (let i = 1; i <= 15; i++) {
      const email = `mock_user${i}@atoz-software.tech`;
      const existing = await this.userRepo.findOneBy({ email });

      if (!existing) {
        usersToSeed.push(
          this.userRepo.create({
            fullname: `Mock User ${i}`,
            email,
            password: hashedPassword,
            department: departments[i % departments.length],
            gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
            isVerified: true,
          }),
        );
      }
    }

    if (usersToSeed.length > 0) {
      await this.userRepo.save(usersToSeed);

      // Now seed the wishlists
      for (let i = 0; i < usersToSeed.length; i++) {
        const userIndex = i + 1; // Matching the loop above
        const wishItems = mockWishlists[userIndex % mockWishlists.length];
        await this.sendWishlistService.createMany(usersToSeed[i].id, wishItems);
      }
    }

    return {
      message: `Seeded ${usersToSeed.length} new users.`,
      default_password: defaultPassword,
    };
  }
}
