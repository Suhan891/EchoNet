import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CommonModule } from 'src/common/common.module';
import { BullModule } from '@nestjs/bullmq';
import { PostsListener } from './listener/post.job-create.listen';
import { PostProcessor } from './workers/post.create.worker';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    CommonModule,
    NotificationModule,
    BullModule.registerFlowProducer({ name: 'posts-task' }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsListener, PostProcessor],
  exports: [PostsService],
})
export class PostsModule {}
