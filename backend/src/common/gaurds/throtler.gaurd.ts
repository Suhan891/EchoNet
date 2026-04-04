import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { authUserDto } from 'src/auth/tokens/token.dto';

@Injectable()
export class UserThrottlerGaurd extends ThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    const user = req?.user as authUserDto | null;
    if (user) return Promise.resolve(user.userId);
    const ip = req?.ip || 'unknown';
    return Promise.resolve(ip);
  }
}
