import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class WsLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(WsLoggerInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const wsCtx = context.switchToWs();
    const event = wsCtx.getPattern();
    const now = Date.now();

    return next.handle().pipe(
      tap(() =>
        this.logger.log(
          `[WS Outgoing] Event: ${event} | ${Date.now() - now}ms`,
        ),
      ),
      catchError((error: unknown) => {
        const responseTime = Date.now() - now;
        this.logger.error(`Event: ${event} | ${responseTime}ms`);

        return throwError(() => error);
      }),
    );
  }
}
