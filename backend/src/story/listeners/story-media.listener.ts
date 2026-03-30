import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import type { CreateStoryMediaEvent } from '../dto/file.type.dto';

@Injectable()
export class CreateStoryMediaListener {
  constructor(@InjectQueue('story') private storyQueue: Queue) {}
  private readonly logger = new Logger(CreateStoryMediaListener.name);

  @OnEvent('story-media.create', { async: true })
  async handleCreateStoryMedia(event: CreateStoryMediaEvent) {
    const job = await this.storyQueue.add('make-story-media', event, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      priority: 1,
    });
    this.logger.log('Queue initialised with job id as ', job.id);
  }
}
