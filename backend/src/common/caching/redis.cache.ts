import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    await this.cache.del(key);
  }

  async delByPattern(pattern: string) {
    const allKey = `${pattern}:*`;
    await this.cache.del(allKey);
  }
}
