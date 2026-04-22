import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FlowProducer } from 'bullmq';
import { StoryCreateDto } from '../dto/story.create.dto';
import { JobStoryCreateDto } from '../dto/job.story-create';

@Injectable()
export class StoryListener {
  constructor(
    @InjectFlowProducer('story-task') private flowProducer: FlowProducer,
  ) {}
  private readonly logger = new Logger(StoryListener.name);

  @OnEvent('story.create')
  async handleCreateStory(events: StoryCreateDto[]) {
    const jobs: JobStoryCreateDto[] = events
      .map((event): JobStoryCreateDto | undefined => {
        if (event.type === 'image')
          return {
            caption: event.caption,
            storyId: event.storyId,
            type: event.type,
            order: event.order,
            imageFile: {
              originalname: event.imageFile.originalname,
              fieldName: event.imageFile.fieldname,
              mimetype: event.imageFile.mimetype,
              destination: event.imageFile.destination,
              filename: event.imageFile.filename,
              path: event.imageFile.path,
              buffer: event.imageFile.buffer.toString('base64'),
            },
          };
        if (event.type === 'video')
          return {
            caption: event.caption,
            storyId: event.storyId,
            type: event.type,
            order: event.order,
            videoFile: {
              originalname: event.videoFile.originalname,
              fieldName: event.videoFile.fieldname,
              mimetype: event.videoFile.mimetype,
              destination: event.videoFile.destination,
              filename: event.videoFile.filename,
              path: event.videoFile.path,
              buffer: event.videoFile.buffer.toString('base64'),
            },
          };
        if (event.type === 'imageAudio') {
          return {
            caption: event.caption,
            storyId: event.storyId,
            type: event.type,
            order: event.order,
            imageFile: {
              originalname: event.imageFile.originalname,
              destination: event.imageFile.destination,
              filename: event.imageFile.filename,
              path: event.imageFile.path,
              fieldName: event.imageFile.fieldname,
              mimetype: event.imageFile.mimetype,
              buffer: event.imageFile.buffer.toString('base64'),
            },
            audioFile: {
              originalname: event.audioFile.originalname,
              fieldName: event.audioFile.fieldname,
              mimetype: event.audioFile.mimetype,
              destination: event.audioFile.destination,
              filename: event.audioFile.filename,
              path: event.audioFile.path,
              buffer: event.audioFile.buffer.toString('base64'),
            },
          };
        }
        return undefined;
      })
      .filter((job): job is JobStoryCreateDto => job !== undefined);

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
