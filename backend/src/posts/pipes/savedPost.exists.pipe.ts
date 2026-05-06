import { BadRequestException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SavePostDto } from '../dto/posts.dto';

export class SavedPostTogglePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(postMediaId: string): Promise<SavePostDto> {
    const postMedia = await this.prisma.postMedia.findUnique({
      where: { id: postMediaId },
      select: {
        id: true,
        savedPosts: {
          select: {
            id: true,
            profileId: true,
          },
        },
        post: {
          select: {
            profileId: true,
          },
        },
      },
    });

    if (!postMedia) throw new BadRequestException('Post Media does not exists');

    return postMedia;
  }
}
