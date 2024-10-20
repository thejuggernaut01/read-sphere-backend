import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as express from 'express';
import helmet from 'helmet';
import * as hpp from 'hpp';
import { ENVIRONMENT } from './common/config/environment';
import { ResponseTransformerInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filter/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: '*',
    },
    bufferLogs: true,
  });

  app.use(helmet());
  app.use(hpp());

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  //  interceptors

  app.useGlobalInterceptors(
    new ResponseTransformerInterceptor(app.get(Reflector)),
  );

  // Set global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // configure logger
  app.useLogger(app.get(Logger));
  // Expose all error including error message, stack trace, etc.
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(ENVIRONMENT.APP.PORT);
}
bootstrap();
