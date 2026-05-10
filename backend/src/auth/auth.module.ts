import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ProfileModule } from 'src/profile/profile.module';
import { CommonModule } from 'src/common/common.module';
import { JwtCreate, JwtVerify } from './tokens/token.service';
import { RefreshGaurd } from './gaurds/refresh-access.gaurd';
import { TokenCreation } from './token.interceptor';
import { BullModule } from '@nestjs/bullmq';
import { AuthListener } from './listeners/email.listen';
import { EmailWorker } from './worker/email.worker';
import { OtpVerificationService } from './services/opt.verification.service';

@Module({
  imports: [
    PrismaModule,
    ProfileModule,
    CommonModule,
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        removeOnComplete: {
          age: 3600, // 1hr
        },
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtCreate,
    RefreshGaurd,
    JwtVerify,
    TokenCreation,
    AuthListener,
    OtpVerificationService,
    EmailWorker,
  ],
})
export class AuthModule {}
