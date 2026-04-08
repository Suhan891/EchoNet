import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { JwtCreate } from './tokens/token.service';

class userDto {
  id: string;
  role: string;
  tokenVersion: string;
}

@Injectable()
export class TokenCreation implements NestInterceptor {
  constructor(private tokenService: JwtCreate) {}
  logger = new Logger(TokenCreation.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const userData = data as userDto;
        //const { id, role, tokenVersion } = data;

        const accessData = { sub: userData.id, role: userData.role };
        const accessToken = this.tokenService.accessToken(accessData);

        const refreshData = {
          sub: userData.id,
          tokenVersion: userData.tokenVersion,
        };
        const refreshToken = this.tokenService.refreshToken(refreshData);

        response.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return { accessToken }; // data which shall be returned
      }),
    );
  }
}
