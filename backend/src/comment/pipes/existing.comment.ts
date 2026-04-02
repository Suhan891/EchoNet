import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidateCommentPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(likeId: string) {
    const comment = await this.prisma.comments.findFirst({
      where: { id: likeId },
      select: {
        profileId: true,
        id: true,
      },
    });

    if (!comment) throw new BadRequestException('No such comment id exists');

    return comment;
  }
}
