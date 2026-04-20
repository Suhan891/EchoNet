import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtVerify } from '../tokens/token.service';

@Injectable()
export class RefreshGaurd implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private tokenService: JwtVerify,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const refreshToken = req.cookies['refreshToken'] as string;

    if (!refreshToken)
      throw new UnauthorizedException('Token unavailable on Cookies');

    const payload = this.tokenService.refreshToken(refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid token');

    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub },
      select: {
        isActive: true,
        tokenVersion: true,
        id: true,
      },
    });
    if (!user) throw new UnauthorizedException('No Such User Exists');

    if (user.isActive !== true)
      throw new BadRequestException(
        'You have been logged out. Please login again',
      );

    if (user.tokenVersion !== payload.tokenVersion)
      throw new BadRequestException(
        'Token version has been rotated. Please login again',
      );

    req.user = user;

    return true;
  }
}
