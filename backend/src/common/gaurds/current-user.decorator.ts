import {
  ConflictException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { authUserDto } from 'src/auth/tokens/token.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): authUserDto => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as authUserDto | null;

    if (!user) throw new ConflictException('User data not received');

    return user;
  },
);
