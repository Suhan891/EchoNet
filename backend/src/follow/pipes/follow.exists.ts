import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidateFollowPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(followId: string) {
    const follow = await this.prisma.follow.findFirst({
      where: {
        id: followId,
      },
      select: {
        followerId: true,
        followingId: true,
      },
    });

    if (!follow) throw new BadRequestException('Invalid follow id');

    return follow;
  }
}
