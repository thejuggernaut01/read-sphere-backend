import {
  ConflictException,
  Injectable,
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
} from '../user/interface';
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
    const existingUser = await this.usersService.findUserByEmail(payload.email);

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
  }

  async login(payload: ILogin) {
    const user = await this.usersService.findUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

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

    return { ...user.dataValues, accessToken, refreshToken };
  }

  async verifyEmail(payload: IVerifyEmail) {
    const user = await this.usersService.findUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

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
  }

  async resendVerifyEmail(payload: IResendVerifyEmail) {
    const user = await this.usersService.findUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

    const code = await this.otpService.createOtp(user.id);

    await this.mailService.sendVerificationEmail('Verify your email', code, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  async forgotPassword(payload: IForgotPassword) {
    const user = await this.usersService.findUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

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
