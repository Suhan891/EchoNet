import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class AppCacheService {
  constructor(
    // @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.redis.set(key, JSON.stringify(value), { EX: ttl ?? 60 });
  }

  async increment(key: string) {
    await this.redis.incr(key);
  }

  async getMatch(key: string): Promise<string[]> {
    const matchKey = `${key}:*`;
    let allKeys = [] as string[];
    let cursor = 0;
    do {
      const result = await this.redis.scan(cursor.toString(), {
        MATCH: matchKey,
        COUNT: 100,
      });
      cursor = Number(result.cursor);
      allKeys = allKeys.concat(result.keys);
    } while (cursor !== 0);
    return allKeys.map((k) => k.replace(`${key}:`, ''));
  }

  async delete(key: string) {
    await this.redis.del(key);
  }

  async delByPattern(pattern: string) {
    const matchKey = `${pattern}:*`;
    let cursor = 0;
    do {
      const result = await this.redis.scan(cursor.toString(), {
        MATCH: matchKey,
        COUNT: 100,
      });
      cursor = Number(result.cursor);
      if (result.keys.length > 0) await this.redis.del(result.keys);
    } while (cursor !== 0);
  }
}
