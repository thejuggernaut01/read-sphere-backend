import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [UserModule, MailModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
