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
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CommonModule } from './common/common.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore as any,
      host: 'localhost',
      port: 6379,
      ttl: 60, // default
    }),
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
    BullModule.registerQueue({ name: 'stories' }, { name: 'email' }),
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
    LikeModule,
    CommentModule,
    CommonModule,
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
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
