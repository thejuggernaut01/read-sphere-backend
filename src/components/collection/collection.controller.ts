import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import {
  BookIdsDto,
  CreateCollectionDto,
  UpdateCollectionDto,
} from './dto/collection.dto';
import { Request } from 'express';
import { ResponseMessage } from '../../common/decorator/response.decorator';
import { RESPONSE_CONSTANT } from '../../common/constants/response.constant';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('')
  async getCollections(@Req() req: Request) {
    const userId = req.currentUser.id;
    return await this.collectionService.getMyCollections(userId);
  }

  @ResponseMessage(RESPONSE_CONSTANT.COLLECTION.CREATE_SUCCESS)
  @Post('')
  async createCollectionWithBooks(
    @Req() req: Request,
    @Body() payload: CreateCollectionDto,
  ) {
    const userId = req?.currentUser.id;
    const { bookIds = [], ...collectionData } = payload;
    return await this.collectionService.createCollection(
      userId,
      collectionData,
      bookIds,
    );
  }

  @ResponseMessage(RESPONSE_CONSTANT.COLLECTION.ADD_BOOK_SUCCESS)
  @Patch(':collectionId/books')
  async addBookToCollection(
    @Req() req: Request,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() payload: BookIdsDto,
  ) {
    const userId = req?.currentUser.id;
    return await this.collectionService.addBookToCollection(
      userId,
      collectionId,
      payload.bookIds,
    );
  }

  @ResponseMessage(RESPONSE_CONSTANT.COLLECTION.UPDATE_SUCCESS)
  @Patch(':collectionId')
  async updateCollection(
    @Req() req: Request,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    const userId = req?.currentUser.id;
    return await this.collectionService.updateCollection(
      userId,
      collectionId,
      updateCollectionDto,
    );
  }

  @ResponseMessage(RESPONSE_CONSTANT.COLLECTION.REMOVE_BOOK_SUCCESS)
  @Delete(':collectionId/books')
  async removeBookFromCollection(
    @Req() req: Request,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() payload: BookIdsDto,
  ) {
    const userId = req?.currentUser.id;
    return await this.collectionService.removeBookFromCollection(
      userId,
      collectionId,
      payload.bookIds,
    );
  }

  @ResponseMessage(RESPONSE_CONSTANT.COLLECTION.DELETE_SUCCESS)
  @Delete(':collectionId')
  async deleteCollection(
    @Req() req: Request,
    @Param('collectionId', ParseIntPipe) collectionId: number,
  ) {
    const userId = req?.currentUser.id;
    return await this.collectionService.deleteCollection(userId, collectionId);
  }
}
