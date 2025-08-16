import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ICreateBook, IUpdateBook } from './interface';
import { InjectModel } from '@nestjs/sequelize';
import { BookModel } from './model/book.model';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
  ) {}

  async createBook(payload: ICreateBook, userId: number): Promise<BookModel> {
    try {
      return await this.bookModel.sequelize.transaction(async (transaction) => {
        const book = await this.bookModel.create(
          { userId, ...payload },
          { transaction },
        );
        return book;
      });
    } catch (error) {
      console.error('Error while creating book:', error);
      throw new InternalServerErrorException(ERROR_CONSTANT.BOOK.UPLOAD_FAILED);
    }
  }

  async getAllBooks() {
    try {
      return await this.bookModel.findAll();
    } catch (error) {
      console.error('Error while retrieving books:', error);
      throw new InternalServerErrorException(
        ERROR_CONSTANT.BOOK.RETRIEVE_FALIED,
      );
    }
  }

  async getMyBooks(userId: number) {
    try {
      if (!userId) {
        throw new BadRequestException(ERROR_CONSTANT.USER.NOT_FOUND);
      }

      return await this.bookModel.findAll({ where: { userId } });
    } catch (error) {
      console.error('Error while retrieving my books:', error);
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(
        ERROR_CONSTANT.BOOK.RETRIEVE_FALIED,
      );
    }
  }

  async getBookDetails(bookId: number) {
    try {
      if (!bookId) {
        throw new NotFoundException(ERROR_CONSTANT.BOOK.ID_REQUIRED);
      }

      const book = await this.bookModel.findByPk(bookId);

      if (!book) {
        throw new NotFoundException(ERROR_CONSTANT.BOOK.NOT_FOUND);
      }

      return book;
    } catch (error) {
      console.error('Error while retrieving book details:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        ERROR_CONSTANT.BOOK.RETRIEVE_FALIED,
      );
    }
  }

  async updateBook(bookId: number, payload: IUpdateBook) {
    try {
      if (!bookId) {
        throw new NotFoundException(ERROR_CONSTANT.BOOK.ID_REQUIRED);
      }

      const [updatedCount, updatedBooks] = await this.bookModel.update(
        payload,
        {
          where: { id: bookId },
          returning: true,
        },
      );

      if (updatedCount === 0)
        throw new NotFoundException(ERROR_CONSTANT.BOOK.NOT_FOUND);

      return updatedBooks[0];
    } catch (error) {
      console.error('Error while updating book:', error);

      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        ERROR_CONSTANT.BOOK.UPDATE_DETAILS_FAILED,
      );
    }
  }

  async deleteBook(bookId: number) {
    if (!bookId) {
      throw new BadRequestException(ERROR_CONSTANT.BOOK.ID_REQUIRED);
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

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(ERROR_CONSTANT.BOOK.DELETE_FAILED);
    }
  }
}
