import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StoryService } from './story.service';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { Throttle } from '@nestjs/throttler';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { StoryMediaValidation } from './pipes/files.validate';
import type { FileValidateDto } from './dto/file.type.dto';
import { currentProfile } from 'src/profile/decorator/get-profile';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { ValidateStoryExists } from './pipes/existing-story';
import type { StoryDto, StoryMediaDataDto } from './dto/story.usage.dto';
import { ValidateStoryMediaPipe } from './pipes/existing-storymedia';
import { ParsedStoryPipe } from './pipes/story.create.validate';
import type { RawMultipartBody } from './dto/story.create.dto';

@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Post('create')
  @ResponseMessage('Story Upload startted')
  @Throttle({ default: { ttl: 24 * 60 * 60 * 1000, limit: 1 } })
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: RawMultipartBody,
  ) {
    const data = new ParsedStoryPipe().transform(files, body);
    console.log(data);
  }

  @Get(':storyId')
  @ResponseMessage('Story Media Id"s Received')
  async getStoryMediaId(
    @currentProfile() profile: profileDto,
    @Param('storyId', ParseUUIDPipe, ValidateStoryExists) story: StoryDto,
  ) {
    return await this.storyService.getStory(profile, story);
  }

  @Get(':storyMediaId')
  @ResponseMessage('Story Media Data Received')
  async getStoryMedia(
    @Param('storyMediaId', ParseUUIDPipe, ValidateStoryMediaPipe)
    storyMedia: StoryMediaDataDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.storyService.getStoryMedia(profile, storyMedia);
  }
}
