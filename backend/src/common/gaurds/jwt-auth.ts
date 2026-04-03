import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public';
import { ACTIVATE_ME, NO_ACCOUNT } from '../../auth/decorators/no-account';

@Injectable()
export class JwtAuthGaurd extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const activatingMe = this.reflector.getAllAndOverride<boolean>(
      ACTIVATE_ME,
      [context.getHandler(), context.getClass()],
    );

    const noAccount = this.reflector.getAllAndOverride<boolean>(NO_ACCOUNT, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noAccount && !activatingMe) return true;

    return super.canActivate(context);
  }
}
