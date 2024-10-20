import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './components/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './components/auth/auth.module';
import { ENVIRONMENT } from './common/config/environment';
import { BookModule } from './components/book/book.module';
import { DatabaseModule } from './components/database/database.module';
import { OtpModule } from './components/otp/otp.module';
import { MailModule } from './components/mail/mail.module';

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
    DatabaseModule,
    UserModule,
    AuthModule,
    BookModule,
    OtpModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
