import { UserService } from './user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Request } from 'express';
import { SerializeResponse } from 'src/common/interceptors/response-serializer.interceptor';
import { UserResponse } from './transformers/user-response.transformer';
import { ResponseMessage } from '../../common/decorator/response.decorator';
import { RESPONSE_CONSTANT } from '../../common/constants/response.constant';

@UseGuards(AuthGuard)
@Controller('user')
@SerializeResponse(UserResponse)
export class UserController {
  constructor(private userService: UserService) {}

  @ResponseMessage(RESPONSE_CONSTANT.USER.GET_CURRENT_USER_SUCCESS)
  @Get('')
  async currentUserData(@Req() req: Request) {
    return await this.userService.findUserById(req.currentUser.id);
  }

  // @Post('')
  // async updateUserData(@Req() req: Request) {}

  // @Delete('')
  // async deleteUserData(@Req() req: Request) {}
}
