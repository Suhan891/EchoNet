import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CommonModule } from 'src/common/common.module';
import { ProfileGaurd } from './gaurds/profile.gaurd';
import { StoryModule } from 'src/story/story.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [CommonModule, StoryModule, PostsModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileGaurd],
  exports: [ProfileService, ProfileGaurd],
})
export class ProfileModule {}
