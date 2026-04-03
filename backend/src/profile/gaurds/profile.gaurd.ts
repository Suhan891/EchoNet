import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { authUserDto } from 'src/auth/tokens/token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from '../dto/profile.dto';
import { Reflector } from '@nestjs/core';
import { NO_PROFILE, NOT_ACTIVE } from '../decorator/no-profile';
import { ACTIVATE_ME } from 'src/auth/decorators/no-account';

@Injectable()
export class ProfileGaurd implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // Auth Gaurd was not immplemented
    if (!req.user) return true;

    const activatingMe = this.reflector.getAllAndOverride<boolean>(
      ACTIVATE_ME,
      [context.getHandler(), context.getClass()],
    );
    if (activatingMe) return true;

    const user = req.user as authUserDto;

    const userId = user.userId;

    const noProfile = this.reflector.getAllAndOverride<boolean>(NO_PROFILE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noProfile) return true;

    const profileId = req.headers['x-profile-id'] as string;

    if (!profileId) throw new ForbiddenException('Profile is required');

    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
        userId: userId,
      },
      select: {
        name: true,
        id: true,
        isActive: true,
      },
    });
    if (!profile) throw new ForbiddenException('Invalid profile');

    const notActive = this.reflector.getAllAndOverride<boolean>(NOT_ACTIVE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (profile.isActive !== true && !notActive)
      throw new BadRequestException('Your profile is not yet active');

    req['profile'] = profile as profileDto;

    return true;
  }
}
