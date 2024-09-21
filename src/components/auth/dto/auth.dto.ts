import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Enter your first name',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Enter your last name',
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Enter a valid email address',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsDate()
  @IsNotEmpty()
  acceptedTCAndPP: Date;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsNumber()
  code: number;
}

export class RequestVerifyEmailOtpDto {
  @IsEmail()
  email: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto extends LoginDto {
  @IsNumber()
  code: number;

  @IsString()
  confirmPassword: string;
}
