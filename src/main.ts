import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  // configure logger
  app.useLogger(app.get(Logger));
  // Expose all error including error message, stack trace, etc.
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(3000);
}
bootstrap();
