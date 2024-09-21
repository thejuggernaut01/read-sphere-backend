import bycrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '../config/environment';

export class BaseHelper {
  static hashData(data: string): Promise<string> {
    return bycrpt.hash(data, 12);
  }

  static compareHashedData(data: string, hashed: string): Promise<boolean> {
    return bycrpt.compare(data, hashed);
  }

  static jwtAccessToken(payload: { id: string }) {
    return jwt.sign(payload, ENVIRONMENT.JWT.ACCESS_TOKEN, {
      expiresIn: ENVIRONMENT.JWT.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  static jwtRefreshToken(payload: { id: string }) {
    return jwt.sign(payload, ENVIRONMENT.JWT.REFRESH_TOKEN, {
      expiresIn: ENVIRONMENT.JWT.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  static verifyJwtAccessToken(token: string) {
    return jwt.verify(token, ENVIRONMENT.JWT.ACCESS_TOKEN);
  }

  static verifyJwtRefreshToken(token: string) {
    return jwt.verify(token, ENVIRONMENT.JWT.REFRESH_TOKEN);
  }
}
