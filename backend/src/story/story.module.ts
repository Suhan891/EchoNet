import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';

@Module({
  imports: [CloudinaryService],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
