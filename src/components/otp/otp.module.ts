import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserOTPModel } from './model/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([UserOTPModel])],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
