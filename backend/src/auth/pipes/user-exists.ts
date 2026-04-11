import {
  Injectable,
  NotFoundException,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtVerify } from '../tokens/token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyDto } from '../dto/verify-email.dto';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtVerify,
  ) {}

  async transform(token: string): Promise<verifyDto> {
    console.log('Token: ', token);
    if (!token) throw new UnauthorizedException('Token Missing');

    const payload = this.jwtService.emailVerifyToken(token);
    if (!payload) throw new UnauthorizedException('Token Invalidated');

    const userId = payload.sub;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isEmailVerified: true,
        username: true,
        role: true,
      },
    });

    if (!user) throw new NotFoundException('No such user exists');

    return user;
  }
}
