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
        synchronize: true, // 生产环境要关掉
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
