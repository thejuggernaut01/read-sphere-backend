import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import { OtpService } from '../otp/otp.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAME } from '../../common/constants/queue.constant';
import { Queue } from 'bullmq';
import { AUTH_JOB_NAMES } from './enum';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../user/model/user.model';
import { Op, Transaction } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    @InjectQueue(QUEUE_NAME.AUTH) private readonly authEmailQueue: Queue,
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async signup(payload: ICreateUser) {
    const transaction: Transaction =
      await this.userModel.sequelize.transaction();

    try {
      const existingUser = await this.userModel.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new ConflictException(ERROR_CONSTANT.AUTH.USER_EXISTS);
      }

      const hashedPassword = await BaseHelper.hashData(payload.password);

      const user = await this.userModel.create(
        { ...payload, password: hashedPassword },
        { transaction },
      );

      transaction.afterCommit(async () => {
        try {
          console.log('Transaction committed for user ID:', user.id);

          const code = await this.otpService.createOtp(user.id);
          console.log('OTP created for user ID:', user.id);

          await this.authEmailQueue.add(
            AUTH_JOB_NAMES.SEND_VERIFICATION_EMAIL,
            {
              subject: 'Verify your email',
              code,
              user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            },
          );
          console.log(
            `Verification email queued for user ID: ${user.id}, Email: ${user.email}`,
          );
        } catch (error) {
          console.error(
            `Error in afterCommit hook for user ID: ${user.id}`,
            error,
          );
        }
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error while signing up user:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        ERROR_CONSTANT.AUTH.REGISTER_FAILED,
      );
    }
  }

  async login(payload: ILogin) {
    try {
      const user = await this.userModel.findOne({
        where: { email: payload.email },
      });

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

      await user.update({ refreshToken });

      return { ...user.dataValues, accessToken, refreshToken };
    } catch (error) {
      console.log('Error while logging user in');

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(ERROR_CONSTANT.AUTH.LOGIN_FAILED);
    }
  }

  async verifyEmail(payload: IVerifyEmail) {
    try {
      const user = await this.userModel.findOne({
        where: { email: payload.email },
      });

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

      await this.authEmailQueue.add(AUTH_JOB_NAMES.SEND_WELCOME_EMAIL, {
        subject: 'Welcome to Read Sphere',
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.log('Error while verifying user', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        ERROR_CONSTANT.AUTH.EMAIL_VERIFICATION_FAILED,
      );
    }
  }

  async resendVerifyEmail(payload: IResendVerifyEmail) {
    try {
      const user = await this.userModel.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
      }

      const code = await this.otpService.createOtp(user.id);

      await this.authEmailQueue.add(AUTH_JOB_NAMES.SEND_VERIFICATION_EMAIL, {
        subject: 'Verify your email',
        code,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.log('Error while resending verification email', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        ERROR_CONSTANT.AUTH.RESEND_VERIFICATION_EMAIL_FAILED,
      );
    }
  }

  async forgotPassword(payload: IForgotPassword) {
    try {
      const user = await this.userModel.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
      }

      const code = await this.otpService.createOtp(user.id);

      await this.authEmailQueue.add(AUTH_JOB_NAMES.SEND_FORGOT_PASSWORD_EMAIL, {
        subject: 'Reset your Read Sphere account password',
        code,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.log('Error while verifying user email for password reset', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        ERROR_CONSTANT.AUTH.PASSWORD_RESET_FAILED,
      );
    }
  }

  async resetPassword(payload: IResetPassword) {
    try {
      const { token, password } = payload;

      const hashedPassword = await BaseHelper.hashData(password);

      const user = await this.userModel.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordTokenExpiration: {
            [Op.gt]: new Date(), // Ensure the token has not expired
          },
        },
      });

      if (!user) {
        throw new NotFoundException(ERROR_CONSTANT.GENERAL.TOKEN);
      }

      await user.update({
        resetPasswordToken: null,
        resetPasswordTokenExpiration: null,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      console.log('Error while resetting password', error);

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        ERROR_CONSTANT.AUTH.PASSWORD_RESET_FAILED,
      );
    }
  }
}
