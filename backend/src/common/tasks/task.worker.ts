import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('clear', { concurrency: 5 })
export class ScheduleWorker extends WorkerHost {
  private readonly logger = new Logger(ScheduleWorker.name);
  constructor(private prisma: PrismaService) {
    super();
  }
  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'email':
        return await this.clearEmail();
      case 'story':
        return await this.clearStory();
    }
  }

  async clearEmail() {
    await this.prisma.user.deleteMany({
      where: {
        isEmailVerified: false,
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
  }

  async clearStory() {
    await this.prisma.story.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(Date.now()),
        },
      },
    });
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    this.logger.log(`Task scheduled ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Scheduled job successfull for ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    return this.logger.error(`Scheduled job failed: ${job.id}`, error.stack);
  }
}
