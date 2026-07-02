import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StoryService } from './story.service';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { Throttle } from '@nestjs/throttler';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { currentProfile } from 'src/profile/decorator/get-profile';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { ValidateStoryExists } from './pipes/existing-story';
import type { StoryDto } from './dto/story.usage.dto';
import { ValidateStoryMediaPipe } from './pipes/existing-storymedia';
import { ParsedStoryPipe } from './pipes/story.create.validate';
import type { RawMultipartBody } from './dto/story.create.dto';

@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Post('create')
  @ResponseMessage('Story Upload startted')
  @Throttle({ default: { ttl: 24 * 60 * 60 * 1000, limit: 3 } })
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: RawMultipartBody,
    @currentProfile() profile: profileDto,
  ) {
    const data = new ParsedStoryPipe().transform(files, body);
    return await this.storyService.createStory(data, profile);
  }

  @Get('own')
  @ResponseMessage(' Own Story details received')
  async ownStory(@currentProfile() profile: profileDto) {
    return await this.storyService.getOwnStory(profile);
  }

  @Put('remove')
  @ResponseMessage('Story Deleted successfully')
  async removeStory(@currentProfile() profile: profileDto) {
    return await this.storyService.removeStory(profile);
  }

  @Get('story/:storyId')
  @ResponseMessage('Story Media Id"s Received')
  async getStoryMediaId(
    @currentProfile() profile: profileDto,
    @Param('storyId', ParseUUIDPipe, ValidateStoryExists) story: StoryDto,
  ) {
    return await this.storyService.getStory(profile, story);
  }

  @Get('media/:storyMediaId')
  @ResponseMessage('Story Media Data Received')
  async getStoryMedia(
    @Param('storyMediaId', ParseUUIDPipe, ValidateStoryMediaPipe)
    storyMedia: StoryDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.storyService.getStoryMedia(profile, storyMedia);
  }
}
