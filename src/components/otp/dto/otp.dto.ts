import { IsInt, IsDate, IsBoolean, IsNotEmpty, Length } from 'class-validator';

export class CreateOtpDto {
  @IsInt({ message: 'User id must be a number' })
  @IsNotEmpty({ message: 'User id is required' })
  userId: number;

  @IsInt({ message: 'Code must be a number' })
  @IsNotEmpty({ message: 'Code is required' })
  @Length(6, 6, { message: 'Code must be 6-digits long' })
  code: number;

  @IsNotEmpty({ message: 'Code is required' })
  @IsDate({ message: 'expiresAt must be a date' })
  expiresAt: Date;

  @IsBoolean({ message: 'isInvalid must be a boolean' })
  isInvalid: boolean;
}

export class ValidateOtpDto {
  @IsInt({ message: 'User id must be a number' })
  @IsNotEmpty({ message: 'User id is required' })
  userId: number;

  @IsInt({ message: 'Code must be a number' })
  @IsNotEmpty({ message: 'Code is required' })
  @Length(6, 6, { message: 'Code must be 6-digits long' })
  code: number;
}
