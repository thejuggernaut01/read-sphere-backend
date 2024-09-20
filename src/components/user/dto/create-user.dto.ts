import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
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

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @IsNotEmpty()
  acceptedTCAndPP: Date;
}
