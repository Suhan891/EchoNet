import { ForbiddenException, Injectable } from '@nestjs/common';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';
import {
  Format,
  NotifyDto,
  NotifyRemoveDto,
  NotifyType,
} from './dto/notification.dto';
import { EventService } from 'src/event/event.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
    private eventService: EventService,
  ) {}

  async getNotifications(profile: profileDto) {
    const key = `profile:${profile.id}:notification`;
    const cachedNotifications = await this.cacheService.get(key);
    if (cachedNotifications) return cachedNotifications;
    const notifications = await this.prisma.notification.findMany({
      where: { receiverId: profile.id },
      select: {
        id: true,
        purpose: true,
        content: true,
        isRead: true,
      },
    });

    await this.cacheService.set<typeof notifications>(key, notifications);
    return notifications;
  }

  async getNoificationData(profile: profileDto, data: NotifyType) {
    const key = `profile:${profile.id}:notification:${data.id}`;
    const cachedData = await this.cacheService.get(key);
    if (cachedData) return cachedData;
    if (!data.isRead) {
      await this.prisma.notification.update({
        where: { id: data.id },
        data: { isRead: true },
      });
      await this.cacheService.delete(`profile:${profile.id}:notification`);
    }
    if (data.format.type === 'STORY') {
      const story = await this.prisma.story.findUniqueOrThrow({
        where: { id: data.format.storyId },
        select: { profileId: true },
      });
      data.format.profileId = story.profileId;
    }
    if (data.format.type === 'POST') {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id: data.format.postId },
        select: { profileId: true },
      });
      data.format.profileId = post.profileId;
    }
    await this.cacheService.set<Format>(key, data.format, 60 * 10);
    return data.format;
  }

  async createNotification(data: NotifyDto) {
    await this.cacheService.delete(`profile:${data.receiverId}:notification`);
    if (data.format.type === 'MESSAGE') {
      const existing = await this.prisma.notification.findFirst({
        where: {
          chatId: data.format.chatId,
          purpose: data.format.type,
          receiverId: data.receiverId,
        },
        select: { id: true },
      });
      if (existing)
        return await this.prisma.notification.update({
          where: { id: existing.id },
          data: { content: data.content },
        });
    }
    await this.prisma.notification.create({
      data: {
        receiverId: data.receiverId,
        purpose: data.format.type,
        content: data.content,
        isRead: false,
        chatId:
          data.format.type === 'CHAT' || data.format.type === 'MESSAGE'
            ? data.format.chatId
            : null,
        postId: data.format.type === 'POST' ? data.format.postId : null,
        reelId: data.format.type === 'REEL' ? data.format.reelId : null,
        storyId: data.format.type === 'STORY' ? data.format.storyId : null,
      },
    });
    await this.eventService.emitNotification(data.receiverId, data.format.type);
  }

  async deleteNotification(profile: profileDto, data: NotifyRemoveDto) {
    if (data.receiverId !== profile.id)
      throw new ForbiddenException('You are not allowed');
    await this.prisma.notification.delete({
      where: { id: data.id },
    });
    await this.cacheService.delete(`profile:${profile.id}:notification`);
  }

  async clearNotifyCacheOfFollowers(profileid: string) {
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { id: profileid },
      select: {
        followers: {
          select: {
            followerId: true,
          },
        },
      },
    });
    if (profile.followers.length === 0) return;
    const newPromise = profile.followers.map(async (prof) => {
      await this.cacheService.delete(`profile:${prof.followerId}:notification`);
      await this.eventService.emitNotification(prof.followerId);
    });
    await Promise.all(newPromise);
  }
}
