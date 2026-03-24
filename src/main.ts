import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Robustly parse WHITE_LIST_URL from .env
  const WHITE_LIST_URL = (configService.get<string>('WHITE_LIST_URL') || '')
    .replace(/[[\]']/g, '') // Remove brackets and single quotes if they persist
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: WHITE_LIST_URL, credentials: true }); // 允许前端域名
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
