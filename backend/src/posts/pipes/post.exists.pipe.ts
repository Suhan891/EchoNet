import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from '../dto/posts.dto';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(postId: string): Promise<PostDto> {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id: postId },
      select: { id: true, profileId: true },
    });
    return post;
  }
}
