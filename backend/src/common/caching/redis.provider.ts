import { createClient, RedisClientType } from 'redis';
import { Provider } from '@nestjs/common';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (): Promise<RedisClientType> => {
    const client = createClient({
      socket: { host: 'localhost', port: 6379 },
    });
    await client.connect();
    return client as RedisClientType;
  },
};
