import { Injectable } from '@nestjs/common';
import { AppCacheService } from 'src/common/caching/redis.cache';

@Injectable()
export class EventService {
  constructor(private cacheService: AppCacheService) {}

  async createOnline(profileId: string) {
    return await this.cacheService.set<boolean>(
      `online:${profileId}`,
      true,
      1000 * 60 * 60 * 24,
    );
  }

  async getAllOnline(): Promise<string[]> {
    return await this.cacheService.getMatch('online');
  }

  async isOnline(profileId: string): Promise<boolean> {
    // If online then only message would be emitted or notified
    const isAvail = await this.cacheService.get(`online:${profileId}`);
    return !!isAvail;
  }

  async markOffline(profileId: string) {
    return this.cacheService.delete(`online:${profileId}`);
  }
}
