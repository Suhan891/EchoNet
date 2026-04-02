import {
  BadGatewayException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { currentProfile } from 'src/profile/decorator/get-profile';
import { ValidateRequestPipe } from './pipes/validate.request';
import type { profileDto } from 'src/profile/dto/profile.dto';
import type { CreateCommmentDto } from './dto/create.dto';
import { ValidateCommentPipe } from './pipes/existing.comment';
import type { CommentDTo } from './dto/request.dto';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private prisma: PrismaService,
  ) {}

  @Post('create')
  @ResponseMessage('Comment created')
  async createComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('name') name: string,
    @Body() comentBody: CreateCommmentDto,
    @currentProfile() profile: profileDto,
  ) {
    if (!name || !id)
      throw new BadGatewayException('Both id and name is required');
    const response = {
      id,
      name,
      profileId: profile.id,
    };
    const data = await new ValidateRequestPipe(this.prisma).transform(response);
    const request = {
      ...data,
      content: comentBody.content,
    };
    return await this.commentService.create(request);
  }

  @Put('remove')
  @ResponseMessage('Like removed successfully')
  async remove(
    @Param('likeId', ParseUUIDPipe, ValidateCommentPipe) comment: CommentDTo,
    @currentProfile() profile: profileDto,
  ) {
    return await this.commentService.remove(profile, comment);
  }
}
