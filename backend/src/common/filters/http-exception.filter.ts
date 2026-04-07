import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse, ExceptionResponse } from '../interfaces/response';

@Catch()
export class GlobaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobaExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url } = request;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: unknown = null;
    let message: string = 'Internal Server Error';

    this.logger.debug(exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      this.logger.debug(res);

      if (typeof res === 'string') message = res;
      else {
        const errorBody = res as ExceptionResponse;
        errorResponse = errorBody.error;
        if (Array.isArray(errorBody.message))
          message = errorBody.message[0] || message;
        else message = errorBody.message || message;
      }
    } else {
      // To handle unexpected code crash or Db errors
      console.error(exception);
      message = (exception as Error).message;
      errorResponse = exception as Error;
    }

    // Logged the error
    this.logger.error(`${method} ${url} ${status} - ${message}`);

    const apiResponse: ApiResponse<any> = {
      success: false,
      message,
      error: errorResponse,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(apiResponse);
  }
}
