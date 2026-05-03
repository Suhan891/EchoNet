import { BadRequestException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OthersPostDto } from '../dto/posts.dto';

export class PostsFromProfilePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(profileId: string): Promise<OthersPostDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        _count: {
          select: {
            posts: true,
          },
        },
        isPrivate: true,
      },
    });
    if (!profile) throw new BadRequestException('Invalid Profile Id');

    if (!profile._count.posts)
      throw new BadRequestException('No post is available');
    return { id: profile.id, isPrivate: profile.isPrivate };
  }
}
