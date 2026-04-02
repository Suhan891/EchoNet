import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidateLikePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(likeId: string) {
    const like = await this.prisma.likes.findFirst({
      where: { id: likeId },
      select: {
        profileId: true,
        id: true,
      },
    });

    if (!like) throw new BadRequestException('No such like id exists');

    return like;
  }
}
