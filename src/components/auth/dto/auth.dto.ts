import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'First name is required',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Last name is required',
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email address is required',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsDate({
    message: 'termsAcceptedAt must be a valid date or date string',
  })
  @IsNotEmpty({ message: 'termsAcceptedAt is required' })
  @Type(() => Date)
  termsAcceptedAt: Date;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  refreshToken: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @IsNotEmpty()
  code: number;
}

export class ResendVerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
