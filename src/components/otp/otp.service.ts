import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OTPModel } from './model/otp.model';
import { InjectModel } from '@nestjs/sequelize';
import { ValidateOtpDto } from './dto/otp.dto';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';
import { Op } from 'sequelize';
import { BaseHelper } from '../../common/utils/helper.utils';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTPModel)
    private readonly otpModel: typeof OTPModel,
  ) {}

  async createOtp(userId: number) {
    try {
      const code = BaseHelper.generateOTP();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const userOtp = this.otpModel.build({
        userId,
        code,
        expiresAt,
        isInvalid: false,
      });

      await userOtp.save();

      return userOtp.code;
    } catch (otpError) {
      console.error('Error while creating OTP', otpError);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.GENERAL.SERVER_ERROR,
      );
    }
  }

  async verifyOTP(payload: ValidateOtpDto) {
    try {
      const { userId, code } = payload;

      // Check if OTP exists and is valid
      const otpRecord = await this.otpModel.findOne({
        where: {
          userId,
          code,
          expiresAt: {
            [Op.gt]: new Date(), // Ensure OTP has not expired
          },
          isInvalid: false,
        },
      });

      if (!otpRecord) {
        throw new NotFoundException(ERROR_CONSTANT.OTP.INVALID);
      }

      // Mark OTP as verified
      otpRecord.isInvalid = true;
      await otpRecord.save();
    } catch (otpError) {
      console.error('Error while verifying OTP', otpError);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.OTP.VERIFICATION_FAILED,
      );
    }
  }
}
