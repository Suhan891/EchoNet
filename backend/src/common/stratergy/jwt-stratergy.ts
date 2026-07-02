import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { accessDto, authUserDto } from 'src/auth/tokens/token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppCacheService } from '../caching/redis.cache';
import { JwtUserDto } from '../interfaces/response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_ACCESS_SECRET',
        'super_secret_access',
      ),
    });
  }

  async validate(payload: accessDto): Promise<authUserDto> {
    const userId = payload.sub;
    let user: JwtUserDto;
    const key = `user:${userId}:jwt`;
    const cachedUser = await this.cacheService.get<JwtUserDto>(key);
    if (cachedUser) {
      user = cachedUser;
    } else {
      const availUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          isEmailVerified: true,
          isActive: true,
          role: true,
          tokenVersion: true,
          profile: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!availUser) throw new NotFoundException('No such user available');
      await this.cacheService.set<typeof availUser>(key, availUser);
      user = availUser;
    }

    if (payload.role !== user.role)
      throw new NotAcceptableException('Role not matching');

    if (user.isEmailVerified !== true)
      throw new BadRequestException('Verify your email firstly');

    if (user.isActive !== true)
      throw new BadRequestException('Your account is not yet active');

    return {
      userId: user.id,
      role: user.role,
      profile: user.profile,
    };
  }
}
