import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestDto, ResLikeDto } from '../dto/request.dto';

@Injectable()
export class ValidateRequestPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: RequestDto): Promise<ResLikeDto> {
    const response = await this.validateName(value);

    return response;
  }

  private async validateName(data: RequestDto): Promise<ResLikeDto> {
    const { name } = data;
    if (name === 'POST') return await this.validatePost(data);
    if (name === 'REEL') return await this.validateReel(data);
    if (name === 'STORY') return await this.validateStoryMedia(data);
    throw new BadRequestException('Invalid name');
  }

  private async validatePost(data: RequestDto): Promise<ResLikeDto> {
    const existingPost = await this.prisma.post.count({
      where: { id: data.id },
    });
    if (!existingPost) throw new BadRequestException('Invalid post id');

    const existingLike = await this.prisma.likes.findUnique({
      where: {
        profileId_postId: {
          postId: data.id,
          profileId: data.profileId,
        },
      },
      select: {
        id: true,
      },
    });

    return {
      ...data,
      likeId: existingLike?.id,
    };
  }

  private async validateReel(data: RequestDto): Promise<ResLikeDto> {
    const existingReel = await this.prisma.reel.count({
      where: { id: data.id },
    });
    if (!existingReel) throw new BadRequestException('Invalid reel');

    const existingLike = await this.prisma.likes.findUnique({
      where: {
        profileId_reelId: {
          profileId: data.profileId,
          reelId: data.id,
        },
      },
      select: {
        id: true,
      },
    });

    return {
      ...data,
      likeId: existingLike?.id,
    };
  }

  private async validateStoryMedia(data: RequestDto): Promise<ResLikeDto> {
    const existingStoryMedia = await this.prisma.storyMedia.count({
      where: { id: data.id },
    });
    if (!existingStoryMedia)
      throw new BadRequestException('Invalid story media');

    const existingLike = await this.prisma.likes.findUnique({
      where: {
        profileId_storyMediaId: {
          profileId: data.profileId,
          storyMediaId: data.id,
        },
      },
      select: {
        id: true,
      },
    });

    return {
      ...data,
      likeId: existingLike?.id,
    };
  }
}
