import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/auth.dto';
import { BaseHelper } from 'src/common/utils/helper.utils';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signup(payload: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findUserByEmail(
        payload.email,
      );

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await BaseHelper.hashData(payload.password);

      const user = await this.usersService.createUser({
        ...payload,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      console.error('Error while creating user', error);
    }
  }

  async login() {}

  async logout() {}

  async sendVerificationEmail() {}
}
