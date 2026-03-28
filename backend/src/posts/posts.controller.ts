import {
  Body,
  Controller,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { CreatePostDto } from './dto/create.post';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { PostMediaValidatorPipe } from './dto/files.validate';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { PostsService } from './posts.service';
import { PostsPhotoExistsPipe } from './pipes/photo-post.exists';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post('create')
  @Throttle({ default: { limit: 2, ttl: 24 * 60 * 60 * 1000 } }) // Allow only 2 requests every 24 hrs
  @ResponseMessage('Post created')
  @UseInterceptors(FilesInterceptor('postMedia', 5))
  async create(
    @Body() data: CreatePostDto,
    @currentProfile() profile: profileDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new PostMediaValidatorPipe({})],
      }),
    )
    postMedia: Array<Express.Multer.File>,
  ) {
    return await this.postService.createPost(profile, data, postMedia);
  }

  @Post('save-post')
  @ResponseMessage('Post Saved successfull')
  async savePost(
    @Param('post-photo', ParseUUIDPipe, PostsPhotoExistsPipe)
    postPhotoId: string,
    @currentProfile() profile: profileDto,
  ) {
    return await this.postService.savePost(profile, postPhotoId);
  }
}
