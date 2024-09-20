import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './model/user.model';
import { Transaction } from 'sequelize';
import { CreateUserDto } from './dto/create-user.dto';

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
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    if (!email) return null;

    const user = await this.userModel.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUser(email: string) {
    const user = await this.findUserByEmail(email);

    await user.update({ email });
  }

  async deleteUser(email: string) {
    const user = await this.findUserByEmail(email);

    await user.destroy();
  }
}
