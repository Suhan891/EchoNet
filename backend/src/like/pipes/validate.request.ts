import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestDto } from '../dto/request.dto';

@Injectable()
export class ValidateRequestPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: RequestDto) {
    const isValid = await this.validateName(value);

    if (!isValid) throw new BadRequestException('Your request is not correct');

    return value;
  }

  private async validateName(data: RequestDto): Promise<boolean> {
    const { name } = data;
    if (name === 'post') return await this.validatePost(data);
    if (name === 'reel') return await this.validateReel(data);
    if (name === 'story') return await this.validateStoryMedia(data);
    return false;
  }

  private async validatePost(data: RequestDto): Promise<boolean> {
    const existingPost = await this.prisma.post.count({
      where: { id: data.id },
    });
    if (!existingPost) return false;

    const existingLike = await this.prisma.likes.count({
      where: {
        profileId: data.profileId,
        postId: data.id,
      },
    });
    if (existingLike) return false;

    return true;
  }

  private async validateReel(data: RequestDto): Promise<boolean> {
    const existingReel = await this.prisma.reel.count({
      where: { id: data.id },
    });
    if (!existingReel) return false;

    const existingLike = await this.prisma.likes.count({
      where: {
        profileId: data.profileId,
        reelId: data.id,
      },
    });
    if (existingLike) return false;

    return true;
  }

  private async validateStoryMedia(data: {
    id: string;
    name: string;
    profileId: string;
  }): Promise<boolean> {
    const existingStoryMedia = await this.prisma.reel.count({
      where: { id: data.id },
    });
    if (!existingStoryMedia) return false;

    const existingLike = await this.prisma.likes.count({
      where: {
        profileId: data.profileId,
        storyMediaId: data.id,
      },
    });
    if (existingLike) return false;

    return true;
  }
}
