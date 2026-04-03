import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDataDto, CommentDTo, ReplyCommentDto } from './dto/request.dto';
import { profileDto } from 'src/profile/dto/profile.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CommentDataDto) {
    if (data.name === 'post') return await this.createPostComment(data);
    if (data.name === 'reel') return await this.createReelComment(data);
  }

  async update(profile: profileDto, comment: CommentDTo, content: string) {
    if (comment.profileId !== profile.id)
      throw new BadRequestException('Not allowed to update');
    return await this.prisma.comments.update({
      where: {
        id: comment.id,
      },
      data: {
        content,
      },
      select: {
        id: true,
        content: true,
      },
    });
  }

  async remove(profile: profileDto, comment: CommentDTo) {
    if (comment.profileId !== profile.id)
      throw new BadRequestException('Not allowed to remove');
    return await this.prisma.comments.delete({
      where: { id: comment.id },
      select: { id: true },
    });
  }

  async reply(comment: ReplyCommentDto) {
    return await this.prisma.comments.create({
      data: {
        parentId: comment.parentId,
        content: comment.content,
        postId: comment.postId,
        reelId: comment.reelId,
        profileId: comment.profileId,
      },
      select: {
        id: true,
        parentId: true,
        content: true,
        postId: true,
        reelId: true,
      },
    });
  }

  private async createPostComment(data: CommentDataDto) {
    return await this.prisma.comments.create({
      data: {
        profileId: data.profileId,
        postId: data.id,
        content: data.content,
      },
      select: {
        id: true,
      },
    });
  }
  private async createReelComment(data: CommentDataDto) {
    return await this.prisma.comments.create({
      data: {
        profileId: data.profileId,
        reelId: data.id,
        content: data.content,
      },
      select: {
        id: true,
      },
    });
  }
}
