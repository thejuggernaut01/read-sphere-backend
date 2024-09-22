import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
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

  async login(payload: LoginDto) {
    try {
      const user = await this.usersService.findUserByEmail(payload.email);

      const match = await BaseHelper.compareHashedData(
        payload.password,
        user.password,
      );

      if (!match) {
        throw new NotFoundException('Email or password incorrect.');
      }

      const accessToken = BaseHelper.jwtAccessToken(user.email);
      const refreshToken = BaseHelper.jwtRefreshToken(user.email);

      await this.usersService.updateUserRefreshToken(user.email, refreshToken);

      return { ...user, accessToken };
    } catch (error) {
      console.error('Error while logging user in', error);
    }
  }

  async logout() {}

  async sendVerificationEmail() {}
}
