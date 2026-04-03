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
import { ValidateReplyPipe } from './pipes/validate.reply.comment';

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

  @Put('update')
  @ResponseMessage('Reply updated')
  async update(
    @Param('commentId', ParseUUIDPipe, ValidateCommentPipe) comment: CommentDTo,
    @Body() commentBody: CreateCommmentDto,
    @currentProfile() profile: profileDto,
  ) {
    const content = commentBody.content;
    return await this.commentService.update(profile, comment, content);
  }

  @Put('reply')
  @ResponseMessage('Replied Successfully')
  async reply(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() commentBody: CreateCommmentDto,
    @currentProfile() profile: profileDto,
  ) {
    if (!commentId)
      throw new BadGatewayException('ParentCommentId is required to proceed');
    const request = {
      parentId: commentId,
      profileId: profile.id,
      content: commentBody.content,
    };
    const data = await new ValidateReplyPipe(this.prisma).transform(request);
    return await this.commentService.reply(data);
  }

  @Put('remove')
  @ResponseMessage('Comment removed successfully')
  async remove(
    @Param('commentId', ParseUUIDPipe, ValidateCommentPipe) comment: CommentDTo,
    @currentProfile() profile: profileDto,
  ) {
    return await this.commentService.remove(profile, comment);
  }
}
