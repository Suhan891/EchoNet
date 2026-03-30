import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
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
    this.logger.log(`Processing job ${job.id}`);

    try {
      switch (job.name) {
        case 'make-story-media': {
          const data = job.data as CreateStoryMediaEvent;

          if (!data) {
            throw new Error('Job data is missing');
          }

          this.logger.log(`Job payload: ${JSON.stringify(data)}`);

          return await this.storyService.createStoryMedia(data);
        }

        case 'remove-story': {
          const data = job.data as string;
          return await this.storyService.deleteStory(data);
        }

        default:
          throw new Error(`Unknown job: ${job.name}`);
      }
    } catch (err) {
      this.logger.error(`Error processing job ${job.id}: ${err}`);
      throw err;
    }
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    this.logger.log(`Job started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `Job ${job.id} completed after ${job.attemptsMade} attempts`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts`,
      err.stack,
    );
  }
}
