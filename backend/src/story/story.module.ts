import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { CommonModule } from 'src/common/common.module';
import { StoryListener } from './listeners/story-media.listener';
import { StoryProcessor } from './workers/story-media.worker';

@Module({
  imports: [CommonModule],
  controllers: [StoryController],
  providers: [StoryService, StoryListener, StoryProcessor],
})
export class StoryModule {}
