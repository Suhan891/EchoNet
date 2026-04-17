import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FlowProducer } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoryCreateDto } from '../dto/story.create.dto';

@Injectable()
export class StoryListener {
  constructor(
    @InjectFlowProducer('story-task') private flowProducer: FlowProducer,
    private readonly prisma: PrismaService,
  ) {}
  private readonly logger = new Logger(StoryListener.name);

  @OnEvent('story.create')
  async handleCreateStory(events: StoryCreateDto[]) {
    await this.flowProducer.add({
      name: 'batch-complete',
      queueName: 'story-task',
      data: events[0].storyId,

      children: events.map((event) => ({
        name: 'process-task',
        queueName: 'story-task',
        data: event,
        opts: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      })),
    });
    this.logger.log('Story Job created');
  }
}
