import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './model/user.model';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async findUserById(userId: number) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

    return user;
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async deleteUser(email: string) {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
    }

    await user.destroy();
  }

  // async updateUserData(userId: number, data: Partial<UserModel>) {
  //   const user = await this.findUserById(userId);

  //   if (!user) {
  //     throw new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST);
  //   }

  //   user.update(data);
  // }
}
