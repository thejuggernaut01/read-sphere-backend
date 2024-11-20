import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CONSTANT } from '../constants/error.constant';

interface IResponseMsg {
  statusCode: number;
  message: string[] | string;
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    const responseMsg: IResponseMsg = exception.getResponse() as IResponseMsg;

    if (exception instanceof HttpException) {
      // If it's a known HttpException, forward it as-is
      response.status(status).json({
        success: false,
        statusCode: status,
        // data: exception.getResponse(),
        message: Array.isArray(responseMsg.message)
          ? responseMsg.message[0]
          : message,
      });
    } else {
      // For all other exceptions, log and return an internal server error
      console.error('Unexpected error:', exception);
      response.status(500).json({
        success: false,
        statusCode: 500,
        message: ERROR_CONSTANT.GENERAL.SERVER_ERROR,
        // timestamp: new Date().toISOString(),
        // path: request.url,
      });
    }
  }
}
