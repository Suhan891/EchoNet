import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from '../dto/posts.dto';

export class PostExistsPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(postId: string): Promise<PostDto> {
    const post = await this.prisma.post.findFirst({
      where: { id: postId },
      select: { id: true, profileId: true },
    });
    if (!post) throw new BadGatewayException('No such Post exists');
    return post;
  }
}
