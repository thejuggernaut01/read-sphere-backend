import { ERROR_CONSTANT } from './../../common/constants/error.constant';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CollectionModel } from './model/collection.model';
import { BookModel } from '../book/model/book.model';
import { ICreateCollection, IUpdateCollection } from './interface';
// import { VISIBILITY } from '../../common/enum/collection';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(CollectionModel)
    private readonly collectionModel: typeof CollectionModel,

    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
  ) {}

  async createCollection(
    userId: number,
    collectionData: ICreateCollection,
    bookIds: number[],
  ) {
    if (!userId) {
      throw new BadRequestException(ERROR_CONSTANT.USER.NOT_FOUND);
    }

    const transaction = await this.collectionModel.sequelize.transaction();

    try {
      const collection = await CollectionModel.create(
        {
          userId,
          ...collectionData,
        },
        { transaction },
      );

      if (bookIds.length === 0) {
        await transaction.commit();
        return collection;
      }

      const books = await this.bookModel.findAll({
        where: {
          id: bookIds,
        },
      });

      if (books.length !== bookIds.length) {
        throw new NotFoundException(ERROR_CONSTANT.BOOK.NOT_FOUND);
      }

      await collection.$set('books', books, { transaction });

      await transaction.commit();
      return collection;
    } catch (error) {
      await transaction.rollback();
      console.error('Error while creating collection:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        ERROR_CONSTANT.COLLECTION.CREATE_FAILED,
      );
    }
  }

  async addBookToCollection(
    userId: number,
    collectionId: number,
    bookIds: number[],
  ) {
    if (!userId) {
      throw new BadRequestException(ERROR_CONSTANT.USER.NOT_FOUND);
    }

    if (!collectionId) {
      throw new BadRequestException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
    }

    const transaction = await this.collectionModel.sequelize.transaction();

    try {
      const [collection, books] = await Promise.all([
        this.collectionModel.findOne({
          where: {
            id: collectionId,
            userId,
          },
        }),
        this.bookModel.findAll({ where: { id: bookIds } }),
      ]);

      if (!collection) {
        throw new NotFoundException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      if (books.length !== bookIds.length) {
        throw new NotFoundException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      const alreadyAddedBooks = await collection.$get('books', {
        where: { id: bookIds },
      });

      // If we don't want user to be able to add already existing books
      // to the collection
      if (alreadyAddedBooks.length > 0) {
        throw new BadRequestException(ERROR_CONSTANT.COLLECTION.BOOK_EXISTS);
      }

      // This will add only books that does not exist in the collection,
      // even if the already existing books were selected.
      // This first approach works, but it depends on the frontend

      // const alreadyAddedBookIdSet = new Set(
      //   alreadyAddedBooks.map((book) => book.id),
      // );
      // const newBooks = books.filter(
      //   (book) => !alreadyAddedBookIdSet.has(book.id),
      // );

      // if (newBooks.length === 0) {
      //   throw new BadRequestException(ERROR_CONSTANT.COLLECTION.BOOK_EXISTS);
      // }

      await collection.$add('books', books, { transaction });
      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      console.log('Error while adding books to collection:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(ERROR_CONSTANT.COLLECTION.ADD_BOOK_FAILED);
    }
  }

  async removeBookFromCollection(
    userId: number,
    collectionId: number,
    bookIds: number[],
  ) {
    if (!userId) {
      throw new BadRequestException(ERROR_CONSTANT.USER.NOT_FOUND);
    }

    if (!collectionId) {
      throw new BadRequestException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
    }

    const transaction = await this.collectionModel.sequelize.transaction();

    try {
      const [collection, books] = await Promise.all([
        this.collectionModel.findOne({
          where: {
            id: collectionId,
            userId,
          },
        }),
        this.bookModel.findAll({ where: { id: bookIds } }),
      ]);

      if (!collection) {
        throw new NotFoundException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      const alreadyAddedBooks = await collection.$get('books', {
        where: { id: bookIds },
      });

      if (alreadyAddedBooks.length === 0) {
        throw new BadRequestException(ERROR_CONSTANT.COLLECTION.BOOK_NOT_IN);
      }

      await collection.$remove('books', books, { transaction });
      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
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

  async getMyCollections(userId: number) {
    try {
      if (!userId) {
        throw new BadRequestException(ERROR_CONSTANT.USER.NOT_FOUND);
      }

      const collection = await this.collectionModel.findAll({
        where: {
          userId,
          // visibility: VISIBILITY.PUBLIC,
        },
      });
      return collection;
    } catch (error) {
      console.log('Error while fetching collection:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.COLLECTION.GET_FAILED,
      );
    }
  }

  async updateCollection(
    userId: number,
    collectionId: number,
    payload: IUpdateCollection,
  ) {
    try {
      if (!userId) {
        throw new BadRequestException(ERROR_CONSTANT.USER.NOT_FOUND);
      }

      if (!collectionId) {
        throw new BadRequestException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      const [rowsUpdated, [updatedCollection]] =
        await this.collectionModel.update(payload, {
          where: {
            id: collectionId,
            userId,
          },
          returning: true,
        });

      if (rowsUpdated === 0) {
        throw new NotFoundException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      return updatedCollection;
    } catch (error) {
      console.error('Error while updating collection:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        ERROR_CONSTANT.COLLECTION.UPDATE_FAILED,
      );
    }
  }

  async shareCollection() {}

  async deleteCollection(userId: number, collectionId: number) {
    if (!userId) {
      throw new BadRequestException(ERROR_CONSTANT.USER.NOT_FOUND);
    }

    if (!collectionId) {
      throw new BadRequestException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
    }

    try {
      const rowsDeleted = await this.collectionModel.destroy({
        where: {
          id: collectionId,
          userId,
        },
      });

      if (rowsDeleted === 0) {
        throw new NotFoundException(ERROR_CONSTANT.COLLECTION.NOT_FOUND);
      }

      return;
    } catch (error) {
      console.error('Error while deleting collection:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        ERROR_CONSTANT.COLLECTION.DELETE_FAILED,
      );
    }
  }
}
