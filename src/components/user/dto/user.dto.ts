import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AUTH_VALIDATION_MSG } from '../constants/auth-messages.constant';

const {
  FIRST_NAME,
  LAST_NAME,
  USER_NAME,
  EMAIL,
  PASSWORD,
  TERMS_ACCEPTED_AT,
  CODE,
} = AUTH_VALIDATION_MSG;

class CreateUserDto {
  @IsString({ message: FIRST_NAME.IS_STRING })
  @IsNotEmpty({ message: FIRST_NAME.IS_NOT_EMPTY })
  @MinLength(2, { message: FIRST_NAME.MIN_LENGTH })
  @MaxLength(50, { message: FIRST_NAME.MAX_LENGTH })
  firstName: string;

  @IsString({ message: LAST_NAME.IS_STRING })
  @IsNotEmpty({ message: LAST_NAME.IS_NOT_EMPTY })
  @MinLength(2, { message: LAST_NAME.MIN_LENGTH })
  @MaxLength(50, { message: LAST_NAME.MAX_LENGTH })
  lastName: string;

  @IsString({ message: USER_NAME.IS_STRING })
  @IsNotEmpty({ message: USER_NAME.IS_NOT_EMPTY })
  @MinLength(2, { message: USER_NAME.MIN_LENGTH })
  @MaxLength(50, { message: USER_NAME.MAX_LENGTH })
  userName: string;

  @IsString({ message: EMAIL.IS_STRING })
  @IsNotEmpty({ message: EMAIL.IS_NOT_EMPTY })
  @IsEmail({}, { message: EMAIL.IS_EMAIL })
  @MaxLength(100, { message: EMAIL.MAX_LENGTH })
  email: string;

  @IsString({ message: PASSWORD.IS_STRING })
  @IsNotEmpty({ message: PASSWORD.IS_NOT_EMPTY })
  @MinLength(6, { message: PASSWORD.MIN_LENGTH })
  @MaxLength(20, { message: PASSWORD.MAX_LENGTH })
  @IsStrongPassword(
    {
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: PASSWORD.IS_STRONG_PASSWORD },
  )
  password: string;

  @IsDate({ message: TERMS_ACCEPTED_AT.IS_DATE })
  @IsNotEmpty({ message: TERMS_ACCEPTED_AT.IS_NOT_EMPTY })
  @Type(() => Date)
  termsAcceptedAt: Date;
}

class LoginDto {
  @IsString({ message: EMAIL.IS_STRING })
  @IsNotEmpty({ message: EMAIL.IS_NOT_EMPTY })
  @IsEmail({}, { message: EMAIL.IS_EMAIL })
  @MaxLength(100, { message: EMAIL.MAX_LENGTH })
  email: string;

  @IsString({ message: PASSWORD.IS_STRING })
  @IsNotEmpty({ message: PASSWORD.IS_NOT_EMPTY })
  @MinLength(6, { message: PASSWORD.MIN_LENGTH })
  @MaxLength(20, { message: PASSWORD.MAX_LENGTH })
  password: string;
}

class VerifyEmailDto {
  @IsString({ message: EMAIL.IS_STRING })
  @IsNotEmpty({ message: EMAIL.IS_NOT_EMPTY })
  @IsEmail({}, { message: EMAIL.IS_EMAIL })
  @MaxLength(100, { message: EMAIL.MAX_LENGTH })
  email: string;

  @IsInt({ message: CODE.IS_INT })
  @IsNotEmpty({ message: CODE.IS_NOT_EMPTY })
  @Length(6, 6, { message: CODE.LENGTH })
  code: number;
}

class ResendVerifyEmailDto {
  @IsString({ message: EMAIL.IS_STRING })
  @IsNotEmpty({ message: EMAIL.IS_NOT_EMPTY })
  @IsEmail({}, { message: EMAIL.IS_EMAIL })
  @MaxLength(100, { message: EMAIL.MAX_LENGTH })
  email: string;
}

class ForgotPasswordDto {
  @IsString({ message: EMAIL.IS_STRING })
  @IsNotEmpty({ message: EMAIL.IS_NOT_EMPTY })
  @IsEmail({}, { message: EMAIL.IS_EMAIL })
  @MaxLength(100, { message: EMAIL.MAX_LENGTH })
  email: string;
}

class ResetPasswordDto {
  @IsString({ message: PASSWORD.IS_STRING })
  @IsNotEmpty({ message: PASSWORD.IS_NOT_EMPTY })
  @MinLength(6, { message: PASSWORD.MIN_LENGTH })
  @MaxLength(20, { message: PASSWORD.MAX_LENGTH })
  @IsStrongPassword(
    {
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: PASSWORD.IS_STRONG_PASSWORD },
  )
  password: string;
}

export {
  CreateUserDto,
  LoginDto,
  VerifyEmailDto,
  ResendVerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
};
