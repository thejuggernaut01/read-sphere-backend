import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CollectionModel } from './model/collection.model';
import { BookModel } from '../book/model/book.model';
import { ERROR_CONSTANT } from 'src/common/constants/error.constant';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(CollectionModel)
    private readonly collectionModel: typeof CollectionModel,

    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
  ) {}

  async addBookToCollection(collectionId: number, bookId: number) {
    try {
      const [collection, book] = await Promise.all([
        this.collectionModel.findByPk(collectionId),
        this.bookModel.findByPk(bookId),
      ]);

      if (!collection || !book) {
        throw new NotFoundException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      const bookAlreadyExists = await collection.$has('books', book);

      if (bookAlreadyExists) {
        throw new BadRequestException(ERROR_CONSTANT.COLLECTION.BOOK_EXISTS);
      }

      await collection.$add('books', book);
    } catch (error) {
      console.log('Error while adding book to collection:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(ERROR_CONSTANT.COLLECTION.ADD_BOOK_FAILED);
    }
  }

  async getCollectionBooks(collectionId: number) {
    try {
      const collection = await this.collectionModel.findByPk(collectionId, {
        include: [BookModel],
      });
      return collection?.books || [];
    } catch (error) {
      console.log('Error while fetching books in collection:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.COLLECTION.GET_FAILED,
      );
    }
  }

  async removeBookFromCollection(collectionId: number, bookId: number) {
    try {
      const [collection, book] = await Promise.all([
        this.collectionModel.findByPk(collectionId),
        this.bookModel.findByPk(bookId),
      ]);

      if (!collection || !book) {
        throw new NotFoundException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      const bookAlreadyExists = await collection.$has('books', book);

      if (!bookAlreadyExists) {
        throw new BadRequestException(ERROR_CONSTANT.COLLECTION.BOOK_NOT_IN);
      }

      await collection.$remove('books', book);
    } catch (error) {
      console.log('Error while removing book to collection:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        ERROR_CONSTANT.COLLECTION.REMOVE_BOOK_FAILED,
      );
    }
  }

  async createCollection() {}

  async getCollections() {}

  async updateCollection() {}

  async deleteCollection() {}

  async shareCollection() {}
}
