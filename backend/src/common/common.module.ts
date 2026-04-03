import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './file-upload/cloudinary.service';
import { EmailService } from './email/email.service';
import { JwtAuthGaurd } from './gaurds/jwt-auth';
import { UserThrottlerGaurd } from './gaurds/throtler.gaurd';
import { JwtStrategy } from './stratergy/jwt-stratergy';
import { ResponseInterceptor } from './interceptors/response';
import { GlobaExceptionFilter } from './filters/http-exception.filter';
import { AppCacheService } from './caching/redis.cache';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RoleGaurd } from './gaurds/roles.gaurd';

@Global()
@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [
    CloudinaryService,
    EmailService,
    JwtAuthGaurd,
    RoleGaurd,
    UserThrottlerGaurd,
    JwtStrategy,
    ResponseInterceptor,
    GlobaExceptionFilter,
    AppCacheService,
  ],
  exports: [
    CloudinaryService,
    EmailService,
    JwtAuthGaurd,
    RoleGaurd,
    AppCacheService,
  ],
})
export class CommonModule {}
