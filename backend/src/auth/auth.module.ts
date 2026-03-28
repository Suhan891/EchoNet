import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [PrismaModule, ProfileModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
