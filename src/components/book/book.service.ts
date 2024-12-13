import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICreateBook, IUpdateBook } from './interface';
import { InjectModel } from '@nestjs/sequelize';
import { BookModel } from './model/book.model';
import { Transaction } from 'sequelize';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
  ) {}

  async createBook(payload: ICreateBook) {
    const transaction: Transaction =
      await this.bookModel.sequelize.transaction();

    try {
      const book = this.bookModel.build(payload);
      await book.save({ transaction });
      await transaction.commit();

      return;
    } catch (error) {
      console.error('Error while creating book:', error);
      throw new InternalServerErrorException(ERROR_CONSTANT.BOOK.UPLOAD_FAILED);
    }
  }

  async getAllBooks() {
    return await this.bookModel.findAll();
  }

  async getMyBooks(userId: number) {
    return await this.bookModel.findAll({ where: { userId } });
  }

  async getBookDetails(bookId: number) {
    const book = await this.bookModel.findByPk(bookId);

    if (!book) {
      throw new NotFoundException(ERROR_CONSTANT.BOOK.NOT_FOUND);
    }

    return book;
  }

  async updateBook(bookId: number, payload: IUpdateBook) {
    try {
      return await BookModel.update(
        { id: bookId },
        {
          where: payload,
        },
      );
    } catch (error) {
      console.log('Error while updating book:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.BOOK.UPDATE_DETAILS_FAILED,
      );
    }
  }

  async deleteBook(bookId: number) {
    if (!bookId) {
      throw new BadRequestException('Book ID is required');
    }

    const transaction = await this.bookModel.sequelize.transaction();

    try {
      await BookModel.destroy({
        where: {
          id: bookId,
        },
        transaction,
      });
      await transaction.commit();

      console.log(`Book with ID ${bookId} deleted successfully`);
    } catch (error) {
      await transaction.rollback();

      console.error(`Error while deleting book with ID ${bookId}:`, error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(ERROR_CONSTANT.BOOK.DELETE_FAILED);
    }
  }
}
