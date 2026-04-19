import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshAccessDto } from '../dto/login.dto';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): RefreshAccessDto => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user as RefreshAccessDto;
  },
);
