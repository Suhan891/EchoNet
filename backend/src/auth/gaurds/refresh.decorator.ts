import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshAccessDto } from '../dto/login.dto';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): RefreshAccessDto => {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Within decorator', request.user);
    return request.user as RefreshAccessDto;
  },
);
