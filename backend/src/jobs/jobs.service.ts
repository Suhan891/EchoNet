import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobData } from './dto/job.status.view.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobStatus } from 'src/generated/prisma/enums';
import { profileDto } from 'src/profile/dto/profile.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
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

  async jobRetry(profile: profileDto, jobData: JobData) {
    if (profile.id !== jobData.profileId)
      throw new BadRequestException(
        'You are not allowed to restart others job',
      );

    if (jobData.status === 'SUCCESS')
      throw new BadRequestException('Job is already successfull');

    if (jobData.status === 'PROGRESS')
      throw new BadRequestException('Job is in progress');

    const job = await this.storyQueue.getJob(jobData.jobId);
    if (!job) {
      // Means success , as it deletes after success
      await this.JobStatusUpdate(jobData.id, 'SUCCESS', profile.id);
      throw new BadRequestException('Job is already successfull');
    }

    await job.retry('failed'); // As it was a failed job
    return this.JobStatusUpdate(jobData.id, 'PROGRESS', profile.id);
  }

  private async JobStatusUpdate(
    id: string,
    status: JobStatus,
    profileId: string,
  ) {
    if (status === 'SUCCESS')
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
