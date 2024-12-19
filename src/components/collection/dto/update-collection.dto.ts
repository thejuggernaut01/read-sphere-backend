import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {}
