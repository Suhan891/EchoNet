import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { StoryService } from '../story.service';
import type { CreateStoryMediaEvent } from '../dto/file.type.dto';

@Processor('story')
export class StoryProcessor extends WorkerHost {
  constructor(private readonly storyService: StoryService) {
    super();
  }
  private readonly logger = new Logger(StoryProcessor.name);
  async process(job: Job): Promise<any> {
    // Task processing
    this.logger.log('Performing job: ', job.id);

    const data = job.data as CreateStoryMediaEvent;
    const result = await this.storyService.createStoryMedia(data);

    if (!result) {
      throw new Error('No result returned');
    }
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    this.logger.log('Got job: ', job.id);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `Job completed with id ${job.id}, on ${job.attemptsMade} returned ${job.returnvalue}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed`, err);
    throw new InternalServerErrorException(err);
  }
}
