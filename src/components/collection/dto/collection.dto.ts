import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { COLLECTION_VALIDATION_MSG } from '../constants/collection-messages.constants';
import { VISIBILITY as Visibility } from '../../../common/enum/collection';

const { NAME, DESC, VISIBILITY } = COLLECTION_VALIDATION_MSG;

export class CreateCollectionDto {
  @IsString({ message: NAME.IS_STRING })
  @IsNotEmpty({ message: NAME.IS_NOT_EMPTY })
  @MinLength(2, { message: NAME.MIN_LENGTH })
  @MaxLength(50, { message: NAME.MAX_LENGTH })
  name: string;

  @IsString({ message: DESC.IS_STRING })
  @IsNotEmpty({ message: DESC.IS_NOT_EMPTY })
  @MinLength(2, { message: DESC.MIN_LENGTH })
  @MaxLength(100, { message: DESC.MAX_LENGTH })
  description: string;

  @IsString({ message: VISIBILITY.IS_STRING })
  @IsNotEmpty({ message: VISIBILITY.IS_NOT_EMPTY })
  visibility: Visibility;
}
