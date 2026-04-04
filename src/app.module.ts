import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChristmasDrawModule } from './christmas-draw/christmas-draw.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { SendWishlistModule } from './send-wishlist/send-wishlist.module';
import { EventConfigModule } from './event-config/event-config.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        autoLoadEntities: true,
        synchronize: false, // 生产环境要关掉
        ssl: {
          // 告诉 TypeORM 使用 SSL 连接
          // 因为 AWS RDS 使用的是它自己签发的 SSL 证书，Node.js 默认不认识这个证书机构，
          // 会拒绝连接。加上这行代码就是告诉 Node.js：“我知道这是 AWS 的证书，虽然你不认识，但它是安全的，
          // 直接连吧!
          rejectUnauthorized: false,
        },
      }),
    }),

    UserModule,
    AuthModule,

    // 这里不用改，.env 就是你的真实 SMTP
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"${config.get('MAIL_FROM_NAME')}" <${config.get('MAIL_FROM_EMAIL')}>`,
        },
      }),
    }),

    ChristmasDrawModule,

    WishlistModule,

    SendWishlistModule,

    EventConfigModule,

    FeedbackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
