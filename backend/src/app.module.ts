import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
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
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { CommonModule } from './common/common.module';
import { RoleGaurd } from './common/gaurds/roles.gaurd';
import { JwtAuthGaurd } from './common/gaurds/jwt-auth';
import { JobsModule } from './jobs/jobs.module';
import { GlobaExceptionFilter } from './common/filters/http-exception.filter';
import { EventModule } from './event/event.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnFail: false,
        removeOnComplete: true,
      },
    }),
    EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
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
          return user?.role === 'ADMIN';
        },
      },
    ]),
    LikeModule,
    CommentModule,
    CommonModule,
    JobsModule,
    EventModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobaExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGaurd,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGaurd,
    },
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
