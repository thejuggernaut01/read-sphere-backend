import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OTPModel } from './model/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([OTPModel])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
