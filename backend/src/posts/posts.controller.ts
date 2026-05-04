import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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
import { PostExistsPipe } from './pipes/post.exists.pipe';
import type {
  OthersPostDto,
  PostDto,
  RemoveSavedPost,
  SavedPostDto,
} from './dto/posts.dto';
import { SavedPostExistsPipe } from './pipes/savedPost.exists.pipe';
import { FindPostQueryDto } from './dto/pagination-filtering.dto';
import { PostsFromProfilePipe } from './pipes/post.profile';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post('create')
  @Throttle({ default: { limit: 5, ttl: 24 * 60 * 60 * 1000 } })
  @ResponseMessage('Post Media Creation started')
  @UseInterceptors(FilesInterceptor('postMedia', 15))
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

  // Update Post later

  @Get('own')
  @ResponseMessage('Own posts data retrived')
  async getOwnPosts(@currentProfile() profile: profileDto) {
    return await this.postService.getOwnPosts(profile);
  }

  @Get('others/:profileId')
  @ResponseMessage('Other Profiles Post data retrevied')
  async getOthersPost(
    @Param('profileId', ParseUUIDPipe, PostsFromProfilePipe)
    othersProf: OthersPostDto,
    @currentProfile() profile: profileDto,
  ) {
    return this.postService.getOthersPost(othersProf, profile);
  }

  @Get('all')
  @ResponseMessage('Paginated post data sent')
  async getAllPost(
    @Query() paginatedData: FindPostQueryDto,
    @currentProfile() profile: profileDto,
  ) {
    console.log(paginatedData);
    return await this.postService.getAllPost(profile, paginatedData);
  }

  @Put('remove-post')
  @ResponseMessage('Post data removed')
  async removePost(
    @Param('postId', ParseUUIDPipe, PostExistsPipe) post: PostDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.postService.removePosts(profile, post);
  }

  @Put('remove-saved-post/:savedpostId')
  @ResponseMessage('Saved Post data removed')
  async removeSavedPost(
    @Param('savedpostId', ParseUUIDPipe, SavedPostExistsPipe)
    savePost: RemoveSavedPost,
    @currentProfile() profile: profileDto,
  ) {
    return await this.postService.deleteSavedPost(savePost, profile);
  }

  @Post('save/:id')
  @ResponseMessage('Post Saved successfull')
  async savePost(
    @Param('id', ParseUUIDPipe, PostsPhotoExistsPipe)
    postMedia: SavedPostDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.postService.savePost(profile, postMedia);
  }

  @Get('posts-saved')
  @ResponseMessage('Retrieved Save Posts')
  async getSavedPost(@currentProfile() profile: profileDto) {
    return await this.postService.getSavedPost(profile);
  }
}
