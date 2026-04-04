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

@Module({
  imports: [PrismaModule, ProfileModule, CommonModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtCreate,
    RefreshGaurd,
    JwtVerify,
    TokenCreation,
  ],
})
export class AuthModule {}
