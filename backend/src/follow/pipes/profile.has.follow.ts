import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileHasFollowPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(profileId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
      },
      select: {
        id: true,
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
      },
    });

    if (!profile) throw new BadRequestException('Invalid profile Id');

    if (!profile._count.followers && !profile._count.followings)
      throw new BadRequestException('Profile has no followers or following');
    return profile.id;
  }
}
