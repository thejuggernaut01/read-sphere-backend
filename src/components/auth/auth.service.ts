import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  ICreateUser,
  ILogin,
  IVerifyEmail,
  IResendVerifyEmail,
  IForgotPassword,
  IResetPassword,
} from './types/auth.types';
import { BaseHelper } from '../../common/utils/helper.utils';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private mailService: MailService,
    private otpService: OtpService,
  ) {}

  async signup(payload: ICreateUser) {
    try {
      const existingUser = await this.usersService.findUserByEmail(
        payload.email,
      );

      if (existingUser) {
        throw new ConflictException(ERROR_CONSTANT.AUTH.USER_EXISTS);
      }

      const hashedPassword = await BaseHelper.hashData(payload.password);

      const user = await this.usersService.createUser({
        ...payload,
        password: hashedPassword,
      });

      const code = await this.otpService.createOtp(user.id);

      await this.mailService.sendVerificationEmail('Verify your email', code, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      console.error('Error while creating user', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.GENERAL.SERVER_ERROR,
      );
    }
  }

  async login(payload: ILogin) {
    try {
      const user = await this.usersService.findUserByEmail(payload.email);

      const isPasswordValid = await BaseHelper.compareHashedData(
        payload.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new NotFoundException(ERROR_CONSTANT.AUTH.LOGIN_FAILED);
      }

      const accessToken = BaseHelper.generateJwtAccessToken(user.id);
      const refreshToken = BaseHelper.generateJwtRefreshToken(user.id);

      await this.usersService.updateUserRefreshToken(user.email, refreshToken);

      return { ...user, accessToken };
    } catch (error) {
      console.error('Error while logging user in', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.GENERAL.SERVER_ERROR,
      );
    }
  }

  async verifyEmail(payload: IVerifyEmail) {
    try {
      const user = await this.usersService.findUserByEmail(payload.email);

      await this.otpService.verifyOTP({
        userId: user.id,
        code: payload.code,
      });

      // Update the user's email verification status
      user.emailVerified = true;
      await user.save();

      await this.mailService.sendWelcomeEmail('Welcome to Read Sphere', {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      console.error('Error while verifying user', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.GENERAL.SERVER_ERROR,
      );
    }
  }

  async resendVerifyEmail(payload: IResendVerifyEmail) {
    try {
      const user = await this.usersService.findUserByEmail(payload.email);

      const code = await this.otpService.createOtp(user.id);

      await this.mailService.sendVerificationEmail('Verify your email', code, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      console.error('Error while resending verification email', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.GENERAL.SERVER_ERROR,
      );
    }
  }

  async forgotPassword(payload: IForgotPassword) {
    try {
      const user = await this.usersService.findUserByEmail(payload.email);

      const code = await this.otpService.createOtp(user.id);

      await this.mailService.sendForgotPasswordEmail(
        'Reset your Read Sphere account password',
        code,
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      );
    } catch (error) {
      console.error('Error while sending reset password email', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.GENERAL.SERVER_ERROR,
      );
    }
  }

  async resetPassword(payload: IResetPassword) {
    const { token, password } = payload;

    const hashedPassword = await BaseHelper.hashData(password);

    await this.usersService.findAndUpdateUserByResetToken(
      token,
      hashedPassword,
    );
  }
}
