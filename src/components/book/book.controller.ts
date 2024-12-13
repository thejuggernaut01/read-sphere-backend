import { BookService } from './book.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Request } from 'express';
import { ResponseMessage } from '../../common/decorator/response.decorator';
import { RESPONSE_CONSTANT } from '../../common/constants/response.constant';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@UseGuards(AuthGuard)
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @ResponseMessage(RESPONSE_CONSTANT.BOOK.ADD_SUCCESS)
  @Post('')
  async addBook(@Body() payload: CreateBookDto) {
    return await this.bookService.createBook(payload);
  }

  @ResponseMessage(RESPONSE_CONSTANT.BOOK.RETRIEVE_SUCCESS)
  @Get('')
  async getAllBooks() {
    return await this.bookService.getAllBooks();
  }

  @ResponseMessage(RESPONSE_CONSTANT.BOOK.RETRIEVE_USER_SUCCESS)
  @Get('/my')
  async getMyBooks(@Req() req: Request) {
    return await this.bookService.getMyBooks(req.currentUser.id);
  }

  @ResponseMessage(RESPONSE_CONSTANT.BOOK.RETRIEVE_SUCCESS)
  @Get('/:bookId')
  async getBookDetails(@Param('bookId') bookId: number) {
    return await this.bookService.getBookDetails(bookId);
  }

  @ResponseMessage(RESPONSE_CONSTANT.BOOK.UPDATE_SUCCESS)
  @Put('/:bookId')
  async updateBook(
    @Param('bookId') bookId: number,
    @Body() payload: UpdateBookDto,
  ) {
    return await this.bookService.updateBook(bookId, payload);
  }

  @ResponseMessage(RESPONSE_CONSTANT.BOOK.DELETE_SUCCESS)
  @Delete('/:bookId')
  async deleteBook(@Param('bookId') bookId: number) {
    return await this.bookService.deleteBook(bookId);
  }
}
