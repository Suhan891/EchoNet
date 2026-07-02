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
import { RedisProvider } from './caching/redis.provider';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleWorker } from './tasks/task.worker';
import { TasksService } from './tasks/task.schedule';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    BullModule.registerQueue({ name: 'clear' }),
  ],
  providers: [
    CloudinaryService,
    RedisProvider,
    EmailService,
    JwtAuthGaurd,
    RoleGaurd,
    UserThrottlerGaurd,
    JwtStrategy,
    ResponseInterceptor,
    GlobaExceptionFilter,
    ScheduleWorker,
    TasksService,
    AppCacheService,
  ],
  exports: [
    CloudinaryService,
    RedisProvider,
    EmailService,
    JwtAuthGaurd,
    RoleGaurd,
    AppCacheService,
  ],
})
export class CommonModule {}
