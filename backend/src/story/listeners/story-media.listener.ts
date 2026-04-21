import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FlowProducer } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoryCreateDto } from '../dto/story.create.dto';
import { JobStoryCreateDto } from '../dto/job.story-create';

@Injectable()
export class StoryListener {
  constructor(
    @InjectFlowProducer('story-task') private flowProducer: FlowProducer,
    private readonly prisma: PrismaService,
  ) {}
  private readonly logger = new Logger(StoryListener.name);

  @OnEvent('story.create')
  async handleCreateStory(events: StoryCreateDto[]) {
    const jobs: JobStoryCreateDto[] = events.map((event) => {
      if (event.type === 'image')
        return {
          caption: event.caption,
          storyId: event.storyId,
          type: event.type,
          imageFile: {
            originalname: event.imageFile.originalname,
            mimetype: event.imageFile.mimetype,
            buffer: event.imageFile.buffer.toString('base64'),
          },
        };
      if (event.type === 'video')
        return {
          caption: event.caption,
          storyId: event.storyId,
          type: event.type,
          videoFile: {
            originalname: event.videoFile.originalname,
            mimetype: event.videoFile.mimetype,
            buffer: event.videoFile.buffer.toString('base64'),
          },
        };
      if (event.type === 'imageAudio') {
        return {
          caption: event.caption,
          storyId: event.storyId,
          type: event.type,
          imageFile: {
            originalname: event.imageFile.originalname,
            mimetype: event.imageFile.mimetype,
            buffer: event.imageFile.buffer.toString('base64'),
          },
          audioFile: {
            originalname: event.audioFile.originalname,
            mimetype: event.audioFile.mimetype,
            buffer: event.audioFile.buffer.toString('base64'),
          },
        };
      }
    });

    await this.flowProducer.add({
      name: 'batch-complete',
      queueName: 'story-task',
      data: events[0].storyId,

      children: jobs.map((job) => ({
        name: 'process-task',
        queueName: 'story-task',
        data: job,
        opts: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      })),
    });
    this.logger.log('Story Job created');
  }
}
