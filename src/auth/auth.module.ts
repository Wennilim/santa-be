import { MailerModule } from '@nestjs-modules/mailer';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthController } from './auth.controller';
import { SendWishlistModule } from 'src/send-wishlist/send-wishlist.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // <- 直接导入 User repository
    MailerModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: config.get<string>('JWT_EXPIRATION') as any,
        },
      }),
    }),
    forwardRef(() => SendWishlistModule),
  ],
  providers: [AuthService, AuthGuard, AdminGuard],
  controllers: [AuthController],
  exports: [AuthGuard, AdminGuard, JwtModule],
})
export class AuthModule {}
