import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from '../interfaces/response';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RESPONSE_MESSAGE } from '../decorators/response-message';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const startTime = Date.now();

    const customMessage =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ||
      'Request SUccessfull';

    return next.handle().pipe(
      map((data: T) => {
        const responseTime = Date.now() - startTime;

        this.logger.log(`${method} ${url} ${responseTime} ms`);
        this.logger.log('Data', data);
        return {
          success: true,
          message: customMessage,
          data,
          timestamp: new Date().toISOString(),
        };
      }),

      catchError((error: unknown) => {
        const responseTime = Date.now() - startTime;
        this.logger.error(`${method} ${url} ${responseTime}ms`);

        return throwError(() => error);
      }),
    );
  }
}
