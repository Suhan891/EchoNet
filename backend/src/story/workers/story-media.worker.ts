import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { StoryService } from '../story.service';
import { CacheStatus, StoryCreateDto } from '../dto/story.create.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';

@Processor('story-task', { concurrency: 5 })
export class StoryProcessor extends WorkerHost {
  constructor(
    private readonly storyService: StoryService,
    private cacheService: AppCacheService,
  ) {
    super();
  }

  private readonly logger = new Logger(StoryProcessor.name);

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'process-task':
        return this.processChild(job);
      case 'batch-complete':
        return this.processParent(job);
    }
  }

  private async processChild(job: Job) {
    const data = job.data as StoryCreateDto;
    if (data.type === 'image')
      return await this.storyService.createImageMedia(data);
    if (data.type === 'video')
      return await this.storyService.createVideoMedia(data);
    if (data.type === 'imgAudio')
      return await this.storyService.createImageAudioMedia(data);
  }

  private processParent(job: Job) {
    // Later here Notification feature to all followers or followings
    const storyId = job.data as string;
    return storyId;
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    this.logger.log(`Job started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    if (job.name === 'batch-complete') {
      const storyId = job.returnvalue as string;
      const key = `story:${storyId}`;
      await this.cacheService.set<CacheStatus>(
        key,
        'successfull',
        1_000 * 60 * 60 * 24,
      );
      this.logger.log(`Job successfull for storyId: ${storyId}`);
    }
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, err: Error) {
    const maxAttempts = job.opts.attempts ?? 3;
    const isExhausted = job.attemptsMade >= maxAttempts;

    if (!isExhausted) {
      this.logger.warn(
        `Job ${job.id} (${job.name}) retrying... attempt ${job.attemptsMade}/${maxAttempts}`,
      );
      return;
    }

    if (job.name === 'process-task') {
      const data = job.data as StoryCreateDto;
      const key = `story:${data.storyId}`;
      await this.cacheService.set<CacheStatus>(
        key,
        'failed',
        1_000 * 60 * 60 * 24,
      );
      this.logger.error(
        `Child task failed for story ${data.storyId}`,
        err.stack,
      );
    }

    if (job.name === 'batch-complete') {
      // Later when notification shall be called
      this.logger.error(`Batch notification job failed: ${job.id}`, err.stack);
    }
  }
}
