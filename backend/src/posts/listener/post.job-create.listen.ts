import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FlowProducer } from 'bullmq';
import type { PostEvent } from '../dto/create.post';
import { JobChildData, JobParentData } from '../dto/job.posts.dto';

@Injectable()
export class PostsListener {
  constructor(
    @InjectFlowProducer('posts-task') private flowProducer: FlowProducer,
  ) {}
  private readonly logger = new Logger(PostsListener.name);

  @OnEvent('posts.create')
  async handleCreateEvent(event: PostEvent) {
    const { medias, postId, profileId, name } = event;
    const parentData = {
      postId,
      profileId,
      name,
    } as JobParentData;
    const childrenData = medias.map(
      (media) =>
        ({
          postId,
          media: {
            originalname: media.originalname,
            fieldName: media.fieldname,
            mimetype: media.mimetype,
            destination: media.destination,
            filename: media.fieldname,
            path: media.path,
            buffer: media.buffer.toString('base64'),
          },
        }) as JobChildData,
    );
    const job = await this.flowProducer.add({
      name: 'batch-complete',
      queueName: 'posts-task',
      data: parentData,
      children: childrenData.map((childData) => ({
        name: 'process-task',
        queueName: 'posts-task',
        data: childData,
        opts: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      })),
    });
    this.logger.log(`Job created for profile ${profileId}`);
    return job.job.id;
  }
}
