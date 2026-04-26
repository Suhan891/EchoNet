import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { StoryService } from '../story.service';
import { StoryCreateDto } from '../dto/story.create.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import {
  AppJob,
  JobParentCreateDto,
  JobStoryCreateDto,
} from '../dto/job.story-create';
import { Readable } from 'node:stream';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('story-task', { concurrency: 5 })
export class StoryProcessor extends WorkerHost {
  constructor(
    private readonly storyService: StoryService,
    private prisma: PrismaService,
    private cacheService: AppCacheService,
  ) {
    super();
  }

  private readonly logger = new Logger(StoryProcessor.name);

  async process(job: AppJob): Promise<any> {
    switch (job.name) {
      case 'process-task':
        return this.processChild(job);
      case 'batch-complete':
        return this.processParent(job);
    }
  }

  private async processChild(job: Job<JobStoryCreateDto>) {
    const data = job.data;

    if (data.type === 'image' && data.imageFile) {
      const imgBuffer = Buffer.from(data.imageFile.buffer, 'base64');
      const result = {
        caption: data.caption,
        storyId: data.storyId,
        type: data.type,
        order: data.order,
        imageFile: {
          originalname: data.imageFile.originalname,
          mimetype: data.imageFile.mimetype,
          fieldname: data.imageFile.fieldName,
          encoding: '7bit',
          destination: data.imageFile.destination,
          filename: data.imageFile.filename,
          path: data.imageFile.path,
          size: imgBuffer.length,
          stream: Readable.from(imgBuffer),
          buffer: imgBuffer,
        },
      };
      return await this.storyService.createImageMedia(result);
    }
    //return await this.storyService.createImageMedia(data);
    if (data.type === 'video' && data.videoFile) {
      const vidBuffer = Buffer.from(data.videoFile.buffer, 'base64');
      const result = {
        caption: data.caption,
        storyId: data.storyId,
        type: data.type,
        order: data.order,
        videoFile: {
          originalname: data.videoFile.originalname,
          mimetype: data.videoFile.mimetype,
          fieldname: data.videoFile.fieldName,
          encoding: '7bit',
          destination: data.videoFile.destination,
          filename: data.videoFile.filename,
          path: data.videoFile.path,
          size: vidBuffer.length,
          stream: Readable.from(vidBuffer),
          buffer: vidBuffer,
        },
      };
      return await this.storyService.createVideoMedia(result);
    }

    if (data.type === 'imageAudio' && data.imageFile && data.audioFile) {
      const imgBuffer = Buffer.from(data.imageFile.buffer, 'base64');
      const audioBuffer = Buffer.from(data.audioFile.buffer, 'base64');
      const result = {
        caption: data.caption,
        storyId: data.storyId,
        type: data.type,
        order: data.order,
        imageFile: {
          originalname: data.imageFile.originalname,
          mimetype: data.imageFile.mimetype,
          fieldname: data.imageFile.fieldName,
          encoding: '7bit',
          destination: data.imageFile.destination,
          filename: data.imageFile.filename,
          path: data.imageFile.path,
          size: imgBuffer.length,
          stream: Readable.from(imgBuffer),
          buffer: imgBuffer,
        },
        audioFile: {
          originalname: data.audioFile.originalname,
          mimetype: data.audioFile.mimetype,
          fieldname: data.audioFile.fieldName,
          encoding: '7bit',
          destination: data.audioFile.destination,
          filename: data.audioFile.filename,
          path: data.audioFile.path,
          size: audioBuffer.length,
          stream: Readable.from(audioBuffer),
          buffer: audioBuffer,
        },
      };
      return await this.storyService.createImageAudioMedia(result);
    }
  }

  private async processParent(job: Job<JobParentCreateDto>) {
    const { storyId, profileId } = job.data;
    await this.prisma.story.update({
      where: { id: storyId },
      data: { isReady: true },
    });
    const profileKey = `profile:${profileId}`;
    await this.cacheService.delByPattern(profileKey);
    // Later here Notification feature to all followers or followings
    return storyId;
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    this.logger.log(`Job started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    if (job.name === 'batch-complete') {
      const storyId = job.returnvalue as string;
      this.logger.log(`Job successfull for storyId: ${storyId}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
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
      this.logger.error(
        `Child task failed for story ${data.storyId}`,
        err.stack,
      );
    }

    if (job.name === 'batch-complete') {
      // Later when notification shall be called
      this.logger.error(`Batch parent job failed: ${job.id}`, err.stack);
    }
  }
}
