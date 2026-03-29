import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class ReelExistsPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(reelId: string) {
    const reel = await this.prisma.reel.findFirst({
      where: { id: reelId },
      select: { id: true, cloudId: true, profileId: true },
    });
    if (!reel) throw new BadGatewayException('No such Reel exists');
    return reel;
  }
}
