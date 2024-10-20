import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './model/user.model';
import { Transaction } from 'sequelize';
import { CreateUserDto } from '../auth/dto/auth.dto';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const transaction: Transaction =
      await this.userModel.sequelize.transaction();

    try {
      const user = this.userModel.build(createUserDto);
      await user.save({ transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      console.error('Error while creating user:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.AUTH.REGISTER_FAILED,
      );
    }
  }

  async findUserByEmail(email: string) {
    try {
      if (!email) return null;

      const user = await this.userModel.findOne({ where: { email } });

      if (!user)
        throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_NOT_FOUND);

      return user;
    } catch (error) {
      console.error('Error while retrieving user data:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.USER.GET_CURRENT_USER_FAILED,
      );
    }
  }

  async findAndUpdateUserByResetToken(token: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordTokenExpiration: {
            [Op.gt]: new Date(), // Ensure the token has not expired
          },
        },
      });

      if (!user) {
        throw new BadRequestException(ERROR_CONSTANT.GENERAL.TOKEN);
      }

      await user.update({
        resetPasswordToken: null,
        resetPasswordTokenExpiration: null,
        password: password,
      });

      return user;
    } catch (error) {
      console.error('Error while updating user data:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.USER.UPDATE_USER_PROFILE_FAILED,
      );
    }
  }

  async updateUserRefreshToken(email: string, token: string) {
    try {
      const user = await this.findUserByEmail(email);

      await user.update({ refreshToken: token });

      return user;
    } catch (error) {
      console.error('Error while updating user data:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.USER.UPDATE_USER_PROFILE_FAILED,
      );
    }
  }

  async deleteUser(email: string) {
    try {
      const user = await this.findUserByEmail(email);

      await user.destroy();
    } catch (error) {
      console.error('Error while deleting user data:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.USER.DELETE_USER_FAILED,
      );
    }
  }
}
