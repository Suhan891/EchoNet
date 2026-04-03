import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { authUserDto, Role } from 'src/auth/tokens/token.dto';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGaurd implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // Auth Gaurd was not immplemented -> so allowed to pass
    if (!req.user) return true;

    const user = req.user as authUserDto;

    const allowedRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (user.role === 'ADMIN') return true;

    if (allowedRole === user.role)
      throw new ForbiddenException('Your role is not allowed to access');

    return true;
  }
}
