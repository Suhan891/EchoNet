import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SavedPostDto } from '../dto/posts.dto';

export class PostsPhotoExistsPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(postsPhotoId: string): Promise<SavedPostDto> {
    const postMedia = await this.prisma.postMedia.findFirst({
      where: { id: postsPhotoId },
      select: {
        id: true,
        savedPosts: {
          select: {
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
    if (!postMedia) throw new BadGatewayException('No such Posts Photo exists');
    return postMedia;
  }
}
