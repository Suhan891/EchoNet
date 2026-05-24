import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobChildData, JobParentData, PostJob } from '../dto/job.posts.dto';
import { Readable } from 'node:stream';
import { PostsService } from '../posts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { Logger } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';

@Processor('posts-task', { concurrency: 5 })
export class PostProcessor extends WorkerHost {
  constructor(
    private postService: PostsService,
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private cacheService: AppCacheService,
  ) {
    super();
  }
  private readonly logger = new Logger(PostProcessor.name);
  async process(job: PostJob) {
    switch (job.name) {
      case 'process-task':
        return this.childJob(job);
      case 'batch-complete':
        return this.parentJob(job);
    }
  }
  private async childJob(job: Job<JobChildData>) {
    const data = job.data;
    const mediaBuffer = Buffer.from(data.media.buffer, 'base64');
    const media = {
      originalname: data.media.originalname,
      mimetype: data.media.mimetype,
      fieldname: data.media.fieldName,
      encoding: '7bit',
      destination: data.media.destination,
      filename: data.media.filename,
      path: data.media.path,
      size: mediaBuffer.length,
      stream: Readable.from(mediaBuffer),
      buffer: mediaBuffer,
    };
    await this.postService.createMedia(data.postId, media);
  }

  private async parentJob(job: Job<JobParentData>) {
    const data = job.data;
    await this.prisma.post.update({
      where: { id: data.postId },
      data: { isReady: true },
    });

    const followers = await this.prisma.follow.findMany({
      where: { followingId: data.profileId },
      select: { followerId: true },
    });

    await this.cacheService.delByPattern(`posts:global`); // To remove all cached posts data after success

    const notifyFollowers = followers.map(async (prof) => {
      if (prof.followerId)
        await this.notificationService.createNotification({
          format: {
            type: 'POST',
            postId: data.postId,
          },
          content: `${data.name} posted a new post`,
          receiverId: prof.followerId,
        });
    });
    await Promise.all(notifyFollowers);

    const profileKey = `profile:${data.profileId}`;
    await this.cacheService.delete(profileKey);
    await this.cacheService.delByPattern(profileKey);
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    this.logger.log(`Job started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    if (job.name === 'batch-complete') {
      this.logger.log(`Job successfull for job: ${job.id}`);
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
      this.logger.error(`Child task failed for job ${job.id}`, err.stack);
    }

    if (job.name === 'batch-complete') {
      // Later when notification shall be called
      this.logger.error(`Batch parent job failed: ${job.id}`, err.stack);
    }
  }
}
