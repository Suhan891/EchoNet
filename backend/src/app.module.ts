import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGaurd } from './common/gaurds/jwt-auth';
import { ProfileGaurd } from './profile/gaurds/profile.gaurd';
import { ConfigModule } from '@nestjs/config';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGaurd,
    },
    {
      provide: APP_GUARD,
      useClass: ProfileGaurd,
    },
  ],
})
export class AppModule {}
