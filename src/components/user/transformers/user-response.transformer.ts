import { Exclude, Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  emailVerified: boolean;

  @Expose()
  id: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  deletedAt: string;

  @Exclude()
  password: string;

  @Exclude()
  termsAcceptedAt: string;

  @Exclude()
  refreshToken: string;

  @Exclude()
  resetPasswordToken: string;

  @Exclude()
  resetPasswordTokenExpiration: string;
}
