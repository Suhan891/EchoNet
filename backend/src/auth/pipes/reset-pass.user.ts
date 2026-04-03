import {
  Injectable,
  NotFoundException,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtVerify } from '../tokens/token.service';

@Injectable()
export class ResetPassPipe implements PipeTransform {
  constructor(
    private prisma: PrismaService,
    private tokenService: JwtVerify,
  ) {}

  async transform(token: string) {
    if (!token) throw new UnauthorizedException('Token Missing');

    const payload = this.tokenService.forgotPassToken(token);
    if (!payload) throw new UnauthorizedException('Token Invalidated');

    const userId = payload.sub;
    const user = await this.prisma.user.findUnique({
      where: { id: userId, passResetExpTime: { lt: new Date() } },
      select: {
        id: true,
        passResetToken: true,
      },
    });

    if (!user) throw new NotFoundException('No such user exists');

    return user;
  }
}
