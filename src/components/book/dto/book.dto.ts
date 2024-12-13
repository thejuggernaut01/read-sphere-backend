import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsISBN,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BOOK_VALIDATION_MSG } from '../constants/book-validation-messages';
import { OmitType, PartialType } from '@nestjs/mapped-types';

const {
  TITLE,
  DESC,
  RATING,
  AUTHOR,
  FILE_URL,
  IMAGE_URL,
  PAGES,
  LANGUAGE,
  PG,
  ISBN13,
  PUBLICATION_DATE,
  UPLOADED_AT,
} = BOOK_VALIDATION_MSG;

export class CreateBookDto {
  @IsString({ message: TITLE.IS_STRING })
  @IsNotEmpty({ message: TITLE.IS_NOT_EMPTY })
  @MinLength(2, { message: TITLE.MIN_LENGTH })
  @MaxLength(100, { message: TITLE.MAX_LENGTH })
  title: string;

  @IsString({ message: DESC.IS_STRING })
  @IsNotEmpty({ message: DESC.IS_NOT_EMPTY })
  @MinLength(2, { message: DESC.MIN_LENGTH })
  @MaxLength(100, { message: DESC.MAX_LENGTH })
  description: string;

  @IsInt({ message: RATING.IS_NUMBER })
  @IsNotEmpty({ message: RATING.IS_NOT_EMPTY })
  @Min(1, { message: RATING.MIN_VALUE })
  @Max(5, { message: RATING.MAX_VALUE })
  rating: number;

  @IsString({ message: AUTHOR.IS_STRING })
  @IsNotEmpty({ message: AUTHOR.IS_NOT_EMPTY })
  author: string;

  @IsString({ message: FILE_URL.IS_STRING })
  @IsNotEmpty({ message: FILE_URL.IS_NOT_EMPTY })
  @IsUrl({}, { message: FILE_URL.IS_URL })
  fileUrl: string;

  @IsString({ message: IMAGE_URL.IS_STRING })
  @IsNotEmpty({ message: IMAGE_URL.IS_NOT_EMPTY })
  @IsUrl({}, { message: IMAGE_URL.IS_URL })
  imageUrl: string;

  @IsInt({ message: PAGES.IS_NUMBER })
  @IsNotEmpty({ message: PAGES.IS_NOT_EMPTY })
  @Min(1, { message: PAGES.MIN_VALUE })
  pages: number;

  @IsString({ message: LANGUAGE.IS_STRING })
  @IsNotEmpty({ message: LANGUAGE.IS_NOT_EMPTY })
  language: string;

  @IsInt({ message: PG.IS_NUMBER })
  @IsNotEmpty({ message: PG.IS_NOT_EMPTY })
  @Min(1, { message: PG.MIN_VALUE })
  pg: number;

  @IsInt({ message: ISBN13.IS_STRING })
  @IsNotEmpty({ message: ISBN13.IS_NOT_EMPTY })
  @IsISBN(13, { message: ISBN13.IS_ISBN })
  isbn13: string;

  @IsDate({ message: PUBLICATION_DATE.IS_DATE })
  @IsNotEmpty({ message: PUBLICATION_DATE.IS_NOT_EMPTY })
  @Type(() => Date)
  publicationDate: Date;

  @IsDate({ message: UPLOADED_AT.IS_DATE })
  @IsNotEmpty({ message: UPLOADED_AT.IS_NOT_EMPTY })
  @Type(() => Date)
  uploadedAt: Date;
}

export class UpdateBookDto extends PartialType(
  OmitType(CreateBookDto, ['uploadedAt'] as const),
) {}
