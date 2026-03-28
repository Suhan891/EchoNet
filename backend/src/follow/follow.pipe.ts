import { BadRequestException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class ValidateFollowExists implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(followId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { id: followId },
      select: { id: true },
    });
    if (!follow) throw new BadRequestException('No such Follow exists');

    return follow.id;
  }
}
