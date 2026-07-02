import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectQueue('clear') private queue: Queue) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleEmailCron() {
    this.logger.log('Scheduled email clear');
    await this.queue.add(`email`, null);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleStoryCron() {
    this.logger.log('Scheduled story clear');
    await this.queue.add(`story`, null);
  }
}
