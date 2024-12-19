import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    console.log(createCollectionDto);
  }

  @Get()
  findAll() {
    console.log();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    console.log(+id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(+id);
  }
}
