import bycrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '../config/environment';
import { randomBytes } from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

export class BaseHelper {
  static hashData(data: string): Promise<string> {
    return bycrpt.hash(data, 12);
  }

  static compareHashedData(data: string, hashed: string): Promise<boolean> {
    return bycrpt.compare(data, hashed);
  }

  static generateRandomString(length = 8) {
    return randomBytes(length).toString('hex');
  }

  static generateOTP(): number {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }

  static isValidFileNameAwsUpload = (fileName: string) => {
    const regex = /^[a-zA-Z0-9_\-/]+\/[a-zA-Z0-9_\-]+(?:\.(jpg|png|jpeg))$/;
    return regex.test(fileName);
  };

  static generateFileName(folderName = 'uploads', mimetype: string) {
    const timeStampInMilliSeconds = Date.now();
    const randomString = crypto.randomUUID();

    return `${folderName}/${randomString}-${timeStampInMilliSeconds}.${mimetype.split('/')[1]}`;
  }

  static validateFileMimeType = (mimetype: string) => {
    const validImageMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!validImageMimeTypes.includes(mimetype)) {
      throw new BadRequestException('Invalid image');
    }
  };

  static generateJwtAccessToken(userId: number) {
    return jwt.sign({ userId }, ENVIRONMENT.JWT.ACCESS_TOKEN, {
      expiresIn: ENVIRONMENT.JWT.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  static generateJwtRefreshToken(userId: number) {
    return jwt.sign({ userId }, ENVIRONMENT.JWT.REFRESH_TOKEN, {
      expiresIn: ENVIRONMENT.JWT.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  static verifyJwtAccessToken(token: string) {
    return jwt.verify(token, ENVIRONMENT.JWT.ACCESS_TOKEN);
  }

  static verifyJwtRefreshToken(token: string) {
    return jwt.verify(token, ENVIRONMENT.JWT.REFRESH_TOKEN);
  }

  static setCookie(
    res: Response,
    name: string,
    value: string | number,
    options: CookieOptions = {},
  ) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: ENVIRONMENT.APP.ENV === 'production',
      path: '/',
      sameSite: 'none',
      ...options,
    });
  }
}
