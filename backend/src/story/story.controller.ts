import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StoryService } from './story.service';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { Throttle } from '@nestjs/throttler';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StoryMediaValidation } from './pipes/files.validate';
import type { FileValidateDto } from './dto/file.type.dto';
import { currentProfile } from 'src/profile/decorator/get-profile';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { ValidateStoryExists } from './pipes/existing-story';
import type { StoryDto, StoryMediaDataDto } from './dto/story.usage.dto';

@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Post('create')
  @ResponseMessage('Story created')
  @Throttle({ default: { ttl: 24 * 60 * 60 * 1000, limit: 1 } })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 3 },
      { name: 'image', maxCount: 7 },
      { name: 'audio', maxCount: 2 },
    ]),
  )
  async createStory(
    @UploadedFiles(new StoryMediaValidation()) files: FileValidateDto,
    @currentProfile() profile: profileDto,
    @Body('fileOrder') fileOrder: string, // Frontend sends: "img1.jpg,vid1.mp4,img2.jpg,img3.jpg+audio.mp4,vid2.mp4"
  ) {
    return this.storyService.createStory(files, fileOrder, profile);
  }

  // @Post('view')
  // @ResponseMessage('Story Media Received')
  // async viewStory(
  //   @Query('storyId', ParseUUIDPipe, ValidateStoryExists) story: StoryDto,
  //   @currentProfile() profile: profileDto,
  // ) {
  //   return await this.storyService.getStory(profile, story);
  // }

  @Get('get-ids')
  @ResponseMessage('Story Media Id"s Received')
  getStoryMediaId(
    @Query('storyId', ParseUUIDPipe, ValidateStoryExists) story: StoryDto,
  ) {
    return story;
  }

  @Get('view-media')
  @ResponseMessage('Story Media Id Data Received')
  async getStoryMedia(
    @Query('storyId', ParseUUIDPipe, ValidateStoryExists)
    storyMedia: StoryMediaDataDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.storyService.getStoryMedia(profile, storyMedia);
  }
}
