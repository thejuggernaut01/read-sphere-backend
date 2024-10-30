import { IsInt, IsDate, IsBoolean } from 'class-validator';

export class CreateOtpDto {
  @IsInt()
  userId: number;

  @IsInt()
  code: number;

  @IsDate()
  expiresAt: Date;

  @IsBoolean()
  isInvalid: boolean;
}

export class ValidateOtpDto {
  @IsInt()
  userId: string;

  @IsInt()
  code: number;
}
