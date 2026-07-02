import { createClient, RedisClientType } from 'redis';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<RedisClientType> => {
    const client = createClient({
      socket: {
        host: config.get<string>('REDIS_HOST', 'localhost'),
        port: config.get<number>('REDIS_PORT', 6379),
      },
    });
    await client.connect();
    return client as RedisClientType;
  },
};
