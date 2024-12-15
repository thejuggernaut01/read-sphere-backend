import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../otp/otp.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME } from '../../common/constants/queue.constant';
import { AuthMailConsumer } from './auth-mail.consumer';

@Module({
  imports: [
    UserModule,
    MailModule,
    OtpModule,
    BullModule.registerQueue({
      name: QUEUE_NAME.AUTH,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnFail: {
          age: 3600, // keep up to 1 hour
          count: 1000, // keep up to 1000 jobs
        },
        removeOnComplete: {
          age: 24 * 3600, // keep up to 24 hours
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMailConsumer],
})
export class AuthModule {}
