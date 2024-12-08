import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
    return this.userModel.findOne({ where: { email } });
  }

  async findAndUpdateUserByResetToken(token: string, password: string) {
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
      password: password,
    });

    return user;
  }

  async updateUserRefreshToken(email: string, token: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

    await user.update({ refreshToken: token });

    return user;
  }

  async deleteUser(email: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

    await user.destroy();
  }

  async findUserById(userId: number) {
    return this.userModel.findByPk(userId);
  }

  // async updateUserData(userId: number, data: Partial<UserModel>) {
  //   const user = await this.findUserById(userId);

  //   if (!user) {
  //     throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
  //   }

  //   user.update(data);
  // }
}
