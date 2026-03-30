import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import type { CreateStoryMediaEvent } from '../dto/file.type.dto';
import type { StoryViewEvent } from '../dto/story.usage.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CreateStoryMediaListener {
  constructor(
    @InjectQueue('story') private storyQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}
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

  @OnEvent('story.view', { async: true }) // As not a very important task so data is handled on events with retry logic other than usage of BullMq
  async handleViewStoryMedia(event: StoryViewEvent) {
    const maximumRetry = 3;
    for (let attempt = 0; attempt < maximumRetry; attempt++) {
      try {
        const storyView = await this.prisma.storyViews.create({
          data: {
            viewerId: event.viewerId,
            storyMediaId: event.storyMediaId,
          },
          select: {
            id: true,
          },
        });

        if (storyView.id) {
          this.logger.log(`Story View created with id ${storyView.id}`);
          return;
        }
      } catch (error) {
        this.logger.error(`Story View failed got ${error}`);
      }
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  @OnEvent('story.delete', { async: true })
  async handleDeleteStory(storyId: string) {
    const job = await this.storyQueue.add('remove-story', storyId);
    if (job.finishedOn) return true;
    return false;
  }
}
