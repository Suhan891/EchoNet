import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeDTo, RequestDto } from './dto/request.dto';
import { profileDto } from 'src/profile/dto/profile.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(data: RequestDto) {
    if (data.name === 'post') return await this.createPostLike(data);
    if (data.name === 'reel') return await this.createReelLike(data);
    if (data.name === 'story') return await this.createStoryLike(data);
  }

  async remove(profile: profileDto, like: LikeDTo) {
    if (like.profileId !== profile.id)
      throw new BadRequestException('You did not Like to delete');

    return await this.prisma.likes.delete({
      where: { id: like.id },
      select: { id: true },
    });
  }

  private async createPostLike(data: RequestDto) {
    return await this.prisma.likes.create({
      data: {
        profileId: data.profileId,
        postId: data.id,
      },
      select: {
        id: true,
      },
    });
  }

  private async createReelLike(data: RequestDto) {
    return await this.prisma.likes.create({
      data: {
        profileId: data.profileId,
        reelId: data.id,
      },
      select: {
        id: true,
      },
    });
  }

  private async createStoryLike(data: RequestDto) {
    return await this.prisma.likes.create({
      data: {
        profileId: data.profileId,
        storyMediaId: data.id,
      },
      select: {
        id: true,
      },
    });
  }
}
