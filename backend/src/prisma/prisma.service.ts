import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client'; // Path to generated client
import { PrismaPg } from '@prisma/adapter-pg';
import { Client } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const client = new Client({ connectionString });
    const adapter = new PrismaPg(client);

    super({ adapter }); // Pass the adapter to the base class
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
