import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { SerializeResponse } from '../../common/interceptors/response-serializer.interceptor';
import { UserDto } from '../user/dto/user.dto';

@Controller('auth')
@SerializeResponse(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);

    return user;
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);

    return user;
  }
}
