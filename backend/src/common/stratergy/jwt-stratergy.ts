import {
  BadGatewayException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { accessDto, authUserDto } from 'src/auth/tokens/token.dto';
// import { AuthDTO, JwtPayload } from '../dto/authorization';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_AUTH_TOKEN || 'super_secret_auth',
    });
  }

  async validate(payload: accessDto): Promise<authUserDto> {
    // Also later attack profile data in auth token
    const userId = payload.sub;
    //const user = await this.authService.userExists(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isEmailVerified: true,
        isActive: true,
        role: true,
      },
    });

    if (!user) throw new NotFoundException('No such user available');

    if (payload.role !== user.role)
      throw new NotAcceptableException('Role not matching');

    if (user.isEmailVerified !== true)
      throw new BadGatewayException('Verify your email firstly');

    if (user.isActive !== true)
      throw new BadGatewayException('Your account is not yet active');
    return { userId: user.id, role: payload.role };
  }
}
