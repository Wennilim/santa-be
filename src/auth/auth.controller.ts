import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/dto/login';
import { CreateUserDto } from 'src/dto/user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('verify')
  @Redirect('http://my-santa-workshop.netlify.app/login?verified=true', 302)
  // @Redirect('http://localhost:5173/login?verified=true', 302)
  async verifyEmail(@Query('token') token: string) {
    const user = await this.authService.verifyToken(token);
    if (!user) throw new NotFoundException('Invalid token');
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() dto: { email: string }) {
    return this.authService.forgotPassword(dto);
  }

  @Post('resetPassword')
  async resetPassword(
    @Body()
    dto: {
      email: string;
      otp: string;
      newPassword: string;
      confirmNewPassword: string;
    },
  ) {
    return this.authService.resetPassword(dto);
  }

  @Post('seed')
  async seed() {
    return this.authService.seedUsers();
  }
}
