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
import { profileDto, ProfileGuardDto } from '../dto/profile.dto';
import { Reflector } from '@nestjs/core';
import { NO_PROFILE, NOT_ACTIVE } from '../decorator/no-profile';
import { ACTIVATE_ME } from 'src/auth/decorators/no-account';
import { AppCacheService } from 'src/common/caching/redis.cache';

@Injectable()
export class ProfileGaurd implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
    private cacheService: AppCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    if (!req.user) return true;

    const activatingMe = this.reflector.getAllAndOverride<boolean>(
      ACTIVATE_ME,
      [context.getHandler(), context.getClass()],
    );
    if (activatingMe) return true;

    const user = req.user as authUserDto;

    const userId = user.userId;

    const notActive = this.reflector.getAllAndOverride<boolean>(NOT_ACTIVE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (notActive) return true;

    const noProfile = this.reflector.getAllAndOverride<boolean>(NO_PROFILE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noProfile) return true;

    const profileId = req.headers['x-profile-id'] as string;

    if (!profileId) throw new ForbiddenException('Profile is required');

    const key = `profile:${profileId}:guard`;

    let profile: ProfileGuardDto;
    const cactchedProfile = await this.cacheService.get<ProfileGuardDto>(key);
    if (cactchedProfile) {
      profile = cactchedProfile;
    } else {
      const availProf = await this.prisma.profile.findUnique({
        where: {
          id: profileId,
          userId: userId,
        },
        select: {
          name: true,
          id: true,
          isPrivate: true,
          user: {
            select: {
              id: true,
            },
          },
          isActive: true,
          bio: true,
        },
      });
      if (!availProf) throw new ForbiddenException('Invalid profile');
      await this.cacheService.set<typeof availProf>(key, availProf);
      profile = availProf;
    }

    if (profile.isActive !== true && !notActive)
      throw new BadRequestException('Your profile is not yet active');

    const belong = user.profile?.some((p) => p.id === profile.id);
    if (!belong)
      throw new BadRequestException(
        'This is not your profile that you can accesss',
      );

    req['profile'] = profile as profileDto;

    return true;
  }
}
