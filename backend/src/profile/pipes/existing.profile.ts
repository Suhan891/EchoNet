import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class ValidateProfileExists implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(profileId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id: profileId },
      select: { id: true },
    });
    if (!profile) throw new BadGatewayException('No such profile exists');
    return profile.id;
  }
}
