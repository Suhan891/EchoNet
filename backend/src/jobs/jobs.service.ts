import { BadRequestException, Injectable } from '@nestjs/common';
import { authUserDto } from 'src/auth/tokens/token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobData } from './dto/job.status.view.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JobStatus } from 'src/generated/prisma/enums';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('story-task') private storyQueue: Queue,
  ) {}

  async jobStatus(user: authUserDto, jobData: JobData) {
    if (user.userId !== jobData.userId)
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
    const job = await this.storyQueue.getJob(jobData.id);
    if (!job) {
      // Means success , as it deletes after success
      return await this.JobStatusUpdate(jobData.id, 'SUCCESS');
    }
    const state = await job.getState();
    if (state === 'completed') {
      return await this.JobStatusUpdate(jobData.id, 'SUCCESS');
    }
    if (state === 'failed') return this.JobStatusUpdate(jobData.id, 'FAILED');

    return {
      id: jobData.id,
      name: jobData.name,
      status: jobData.status,
    };
  }

  async jobRetry(user: authUserDto, jobData: JobData) {
    if (user.userId !== jobData.userId)
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
      await this.JobStatusUpdate(jobData.id, 'SUCCESS');
      throw new BadRequestException('Job is already successfull');
    }

    await job.retry('failed'); // As it was a failed job
    return this.JobStatusUpdate(jobData.id, 'PROGRESS');
  }

  private async JobStatusUpdate(id: string, status: JobStatus) {
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
