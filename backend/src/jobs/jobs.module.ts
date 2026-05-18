import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { BullModule } from '@nestjs/bullmq';
import { JobValidatePipe } from './pipe/job.validate.pipe';
import { CommonModule } from 'src/common/common.module';
import { StoryModule } from 'src/story/story.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'story-task' }),
    CommonModule,
    StoryModule,
    PostsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, JobValidatePipe],
})
export class JobsModule {}
