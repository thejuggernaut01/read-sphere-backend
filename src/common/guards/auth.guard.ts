import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_CONSTANT } from '../constants/error.constant';
import { BaseHelper } from '../utils/helper.utils';
import { UserService } from '../../components/user/user.service';
import * as jwt from 'jsonwebtoken';
import { IDecodedToken } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  // Improve auth to factor in reactive streams and real-time data environments
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const accessToken = request.cookies['readsphere-access-token'];
    const refreshToken = request.cookies['readsphere-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException(
        `Unauthorized Access - ${ERROR_CONSTANT.GENERAL.TOKEN}`,
      );
    }

    try {
      if (!accessToken) {
        // if access token is not present,
        // verify the refresh token, generate and set new access token
        const { accessToken, currentUser } =
          await this.generateAccessToken(refreshToken);

        // Set access token
        BaseHelper.setCookie(response, 'readsphere-access-token', accessToken, {
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // add current user to request object
        request.currentUser = { id: currentUser.id };
      } else {
        const decodeAccessToken = BaseHelper.verifyJwtAccessToken(
          accessToken,
        ) as IDecodedToken;

        const currentUser = await this.handleUserVerification(
          decodeAccessToken.userId,
          refreshToken,
        );

        // add current user to request object
        request.currentUser = { id: currentUser.id };
      }
    } catch (error) {
      if (
        (error instanceof jwt.JsonWebTokenError ||
          error instanceof jwt.TokenExpiredError) &&
        refreshToken
      ) {
        // verify the refresh token, generate and set new access token
        const { accessToken, currentUser } =
          await this.generateAccessToken(refreshToken);

        // Set access token
        BaseHelper.setCookie(response, 'readsphere-access-token', accessToken, {
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // add current user to request object
        request.currentUser = { id: currentUser.id };
      } else {
        console.error('Error while re-authenticating user:', error);
        throw new UnauthorizedException(ERROR_CONSTANT.GENERAL.ERROR);
      }
    }

    return true;
  }

  async handleUserVerification(userId: number, refreshToken: string) {
    const user = await this.userService.findUserById(userId);

    // Check if user doesn't exist
    if (!user) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.UNAUTHORIZED);
    }

    // Check if refresh token is invalid
    if (user.refreshToken !== refreshToken) {
      throw new NotFoundException(ERROR_CONSTANT.AUTH.UNAUTHORIZED);
    }

    // Check for the following and invalidate the token:
    // 1. If user is suspended
    // 2. If user isn't verified
    // 3. if user has changed password after the token was issued

    return user;
  }

  async generateAccessToken(refreshToken: string) {
    try {
      const decodeRefreshToken = BaseHelper.verifyJwtRefreshToken(
        refreshToken,
      ) as IDecodedToken;

      const currentUser = await this.handleUserVerification(
        decodeRefreshToken.userId,
        refreshToken,
      );

      // generate access token
      const accessToken = BaseHelper.generateJwtAccessToken(currentUser.id);

      return {
        accessToken,
        currentUser,
      };
    } catch (error) {
      console.log('Session validation failed', error);
      throw new UnauthorizedException(ERROR_CONSTANT.AUTH.EXPIRED_SESSION);
    }
  }
}
