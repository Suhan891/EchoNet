import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { ProfileGaurd } from './profile/gaurds/profile.gaurd';
import { ConfigModule } from '@nestjs/config';
import { FollowModule } from './follow/follow.module';
import { PostsModule } from './posts/posts.module';
import { StoryModule } from './story/story.module';
import { ReelsModule } from './reels/reels.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { Request } from 'express';
import { authUserDto } from './auth/tokens/token.dto';
import { UserThrottlerGaurd } from './common/gaurds/throtler.gaurd';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    FollowModule,
    PostsModule,
    StoryModule,
    ReelsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
        skipIf: (context) => {
          const request = context.switchToHttp().getRequest<Request>();
          const user = request.user as authUserDto;
          return user.role === 'ADMIN';
        },
      },
    ]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ProfileGaurd,
    },
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGaurd,
    },
  ],
})
export class AppModule {}
