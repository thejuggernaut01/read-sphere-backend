import { UserService } from './user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Request } from 'express';
import { SerializeResponse } from 'src/common/interceptors/response-serializer.interceptor';
import { UserDto } from './dto/user.dto';

@UseGuards(AuthGuard)
@Controller('user')
@SerializeResponse(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  async currentUserData(@Req() req: Request) {
    return this.userService.findUserById(req.currentUser.id);
  }

  // @Post('update-user')
  // async updateUserData(@Req() req: Request) {}
}
