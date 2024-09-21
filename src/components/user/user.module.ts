import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './model/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
