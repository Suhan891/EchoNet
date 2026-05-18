import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobData } from './dto/job.status.view.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobStatus } from 'src/generated/prisma/enums';
import { profileDto } from 'src/profile/dto/profile.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { StoryService } from 'src/story/story.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
    private storyService: StoryService,
    private postService: PostsService,
    @InjectQueue('story-task') private storyQueue: Queue,
  ) {}

  async jobStatus(profile: profileDto, jobData: JobData) {
    if (profile.id !== jobData.profileId)
      throw new BadRequestException(
        'You are not allowed to view others status',
      );
    if (jobData.status === 'SUCCESS' || jobData.status === 'FAILED') {
      return {
        id: true,
        name: jobData.name,
        status: jobData.status,
      };
    }
    const job = await this.storyQueue.getJob(jobData.jobId);
    if (!job) {
      return await this.JobStatusUpdate(jobData.id, 'SUCCESS', profile.id);
    }
    const state = await job.getState();
    if (state === 'completed') {
      return await this.JobStatusUpdate(jobData.id, 'SUCCESS', profile.id);
    }
    if (state === 'failed')
      return this.JobStatusUpdate(jobData.id, 'FAILED', profile.id);

    return {
      id: jobData.id,
      name: jobData.name,
      status: jobData.status,
    };
  }

  async jobCancel(profile: profileDto, jobData: JobData) {
    if (profile.id !== jobData.profileId)
      throw new BadRequestException('You are not allowed to cancel others job');

    if (jobData.status !== 'FAILED')
      throw new BadRequestException('You can only cancel failed jobs');

    const failedJob = await this.prisma.job.update({
      where: { id: jobData.id },
      data: { status: 'CANCELLED' },
      select: {
        id: true,
        storyId: true,
        name: true,
        postId: true,
      },
    });

    if (failedJob.name === 'STORY' && failedJob.storyId) {
      await this.storyService.deleteStory(failedJob.storyId, profile.id);
    }
    if (failedJob.name === 'POST' && failedJob.postId) {
      await this.postService.deletePost(failedJob.postId);
    }

    await this.cacheService.delete(`profile:${profile.id}`);
  }

  async jobRetry(profile: profileDto, jobData: JobData) {
    if (profile.id !== jobData.profileId)
      throw new BadRequestException(
        'You are not allowed to restart others job',
      );

    if (jobData.status !== 'FAILED')
      throw new BadRequestException('You can only retry failed jobs');

    const job = await this.storyQueue.getJob(jobData.jobId);
    if (!job) {
      await this.JobStatusUpdate(jobData.id, 'SUCCESS', profile.id);
      throw new BadRequestException('Job is already completed');
    }

    await job.retry('failed');
    return this.JobStatusUpdate(jobData.id, 'PROGRESS', profile.id);
  }

  private async JobStatusUpdate(
    id: string,
    status: JobStatus,
    profileId: string,
  ) {
    await this.cacheService.delete(`profile:${profileId}`);
    return await this.prisma.job.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }
}
