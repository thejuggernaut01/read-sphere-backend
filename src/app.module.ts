import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './components/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './components/auth/auth.module';
import { ENVIRONMENT } from './common/config/environment';
import { BookModule } from './components/book/book.module';

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

    // Database configuration
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          dialect: 'postgres',
          host: 'localhost',
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadModels: true, // Automatically load all models registered with SequelizeModule.forFeature
          synchronize: true,
        };
      },
    }),
    UserModule,
    AuthModule,
    BookModule,
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
