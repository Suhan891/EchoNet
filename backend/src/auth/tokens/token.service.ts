import { JwtService } from '@nestjs/jwt';
import {
  accessDto,
  emailverifyDto,
  passResetDto,
  refreshDto,
} from './token.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class JwtCreate {
  constructor(private jwtService: JwtService) {}

  emailVerifyToken(payload: emailverifyDto) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_EMAIL_VERIFY || 'email_verify',
      expiresIn: '1d',
    });
  }

  accessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access',
      expiresIn: '30m',
    });
  }

  refreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh',
      expiresIn: '1d',
    });
  }

  forgotPassToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_PASSWORD_SECRET || 'forgot_pass',
      expiresIn: '1d',
    });
  }
}

@Injectable()
export class JwtVerify {
  constructor(private jwtService: JwtService) {}

  emailVerifyToken(token: string): emailverifyDto | null {
    try {
      return this.jwtService.verify<emailverifyDto>(token, {
        // Asked to send the data in the format of dto
        secret: process.env.JWT_EMAIL_VERIFY || 'email_verify',
      });
    } catch (e) {
      console.error('Token error', e);
      throw new ForbiddenException('Invalid Token');
    }
  }

  accessToken(token: string): accessDto | null {
    try {
      return this.jwtService.verify<accessDto>(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'access',
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }

  refreshToken(token: string): refreshDto | null {
    try {
      return this.jwtService.verify<refreshDto>(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh',
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }

  forgotPassToken(token: string): passResetDto | null {
    try {
      return this.jwtService.verify<passResetDto>(token, {
        secret: process.env.JWT_PASSWORD_SECRET || 'forgot_pass',
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }
}
