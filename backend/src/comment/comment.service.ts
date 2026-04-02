import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDataDto, CommentDTo } from './dto/request.dto';
import { profileDto } from 'src/profile/dto/profile.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CommentDataDto) {
    if (data.name === 'post') return await this.createPostComment(data);
    if (data.name === 'reel') return await this.createReelComment(data);
  }

  async remove(profile: profileDto, comment: CommentDTo) {
    if (comment.profileId !== profile.id)
      throw new BadRequestException('Not allowed to remove');
    return await this.prisma.comments.delete({
      where: { id: comment.id },
      select: { id: true },
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
