import { JwtService } from '@nestjs/jwt';
import {
  accessDto,
  emailverifyDto,
  passResetDto,
  refreshDto,
} from './token.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtCreate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  emailVerifyToken(payload: emailverifyDto) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_EMAIL_VERIFY',
        'super_secret_email_token',
      ),
      expiresIn: '1d',
    });
  }

  accessToken(payload: accessDto) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'super_secret_access',
      ),
      expiresIn: '30m',
    });
  }

  refreshToken(payload: refreshDto) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'super_secret_refresh',
      ),
      expiresIn: '7d',
    });
  }

  forgotPassToken(payload: passResetDto) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_PASSWORD_SECRET',
        'super_secret_password_token',
      ),
      expiresIn: '1d',
    });
  }
}

@Injectable()
export class JwtVerify {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  emailVerifyToken(token: string): emailverifyDto | null {
    try {
      return this.jwtService.verify<emailverifyDto>(token, {
        secret: this.configService.get<string>(
          'JWT_EMAIL_VERIFY',
          'super_secret_email_token',
        ),
      });
    } catch (e) {
      console.error('Token error', e);
      throw new ForbiddenException('Invalid Token');
    }
  }

  accessToken(token: string): accessDto | null {
    try {
      return this.jwtService.verify<accessDto>(token, {
        secret: this.configService.get<string>(
          'JWT_ACCESS_SECRET',
          'super_secret_access',
        ),
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }

  refreshToken(token: string): refreshDto | null {
    try {
      return this.jwtService.verify<refreshDto>(token, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
          'super_secret_refresh',
        ),
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }

  forgotPassToken(token: string): passResetDto | null {
    try {
      return this.jwtService.verify<passResetDto>(token, {
        secret: this.configService.get<string>(
          'JWT_PASSWORD_SECRET',
          'super_secret_password_token',
        ),
      });
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }
}
