import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './components/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './components/auth/auth.module';
import { ENVIRONMENT } from './common/config/environment';
import { BookModule } from './components/book/book.module';
import { DatabaseModule } from './components/database/database.module';
import { OtpModule } from './components/otp/otp.module';
import { MailModule } from './components/mail/mail.module';
import { CollectionModule } from './components/collection/collection.module';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [
    // dotenv configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${ENVIRONMENT.APP.ENV}` as string,
    }),
    // Logger configuration using pino
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          maxRetriesPerRequest: null,
          enableOfflineQueue: false,
          offlineQueue: false,
        },
      }),
    }),
    BullBoardModule.forRoot({
      adapter: ExpressAdapter,
      route: '/bull-board/queues',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    BookModule,
    OtpModule,
    MailModule,
    CollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
