import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { EventGateway } from './event.gateway';
import { Purpose } from 'src/generated/prisma/enums';

@Injectable()
export class EventService {
  constructor(
    private cacheService: AppCacheService,
    @Inject(forwardRef(() => EventGateway)) private emitEvent: EventGateway,
  ) {}

  async createOnline(profileId: string) {
    return await this.cacheService.set<boolean>(
      `online:${profileId}`,
      true,
      60 * 30,
    );
  }

  async getAllOnline(): Promise<string[]> {
    return await this.cacheService.getMatch('online');
  }

  async emitNotification(receiverId: string, purpose?: Purpose) {
    const isAvail = await this.isOnline(receiverId);
    if (!isAvail) return;
    this.emitEvent.sendNotification(receiverId, purpose);
  }

  async isOnline(profileId: string): Promise<boolean> {
    // If online then only message would be emitted or notified
    const isAvail = await this.cacheService.get(`online:${profileId}`);
    return !!isAvail;
  }

  sendMsg(profileId: string, chatId: string, content: string) {
    this.emitEvent.sendMsg(profileId, chatId, content);
  }

  async markOffline(profileId: string) {
    return this.cacheService.delete(`online:${profileId}`);
  }
}
