import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestDto } from '../dto/request.dto';

@Injectable()
export class ValidateRequestPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(value: RequestDto) {
    if (value.name !== 'POST' && value.name !== 'REEL')
      throw new BadRequestException('Invalid type received');

    if (value.name === 'POST') {
      const post = await this.prisma.post.count({
        where: { id: value.id },
      });
      if (!post) throw new BadRequestException('Invalid Post id');
    }

    if (value.name === 'REEL') {
      const reel = await this.prisma.comments.count({
        where: { id: value.id },
      });
      if (!reel) throw new BadRequestException('Invalid reel id');
    }

    const existingComment = await this.prisma.comments.count({
      where: {
        profileId: value.profileId,
        postId: value.name === 'POST' ? value.id : null,
        reelId: value.name === 'REEL' ? value.id : null,
        parentComment: null,
      },
    });
    if (existingComment)
      throw new BadRequestException('Comment already created');
    return value;
  }
}
