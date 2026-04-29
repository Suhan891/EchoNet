import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CommonModule } from 'src/common/common.module';
import { BullModule } from '@nestjs/bullmq';
import { PostsListener } from './listener/post.job-create.listen';
import { PostProcessor } from './workers/post.create.worker';

@Module({
  imports: [
    CommonModule,
    BullModule.registerFlowProducer({ name: 'posts-task' }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsListener, PostProcessor],
})
export class PostsModule {}
