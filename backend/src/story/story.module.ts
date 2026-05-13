import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { CommonModule } from 'src/common/common.module';
import { StoryListener } from './listeners/story-media.listener';
import { StoryProcessor } from './workers/story-media.worker';
import { BullModule } from '@nestjs/bullmq';
import { ParsedStoryPipe } from './pipes/story.create.validate';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    CommonModule,
    NotificationModule,
    BullModule.registerFlowProducer({ name: 'story-task' }),
  ],
  controllers: [StoryController],
  providers: [StoryService, StoryListener, StoryProcessor, ParsedStoryPipe],
  exports: [StoryService],
})
export class StoryModule {}
