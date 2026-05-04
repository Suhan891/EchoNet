import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowFromProfileDto } from '../dto/validate-follow.dto';

@Injectable()
export class ValidateFollowProfilePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(profileId: string): Promise<FollowFromProfileDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        followers: {
          select: {
            followerId: true,
          },
        },
      },
    });

    if (!profile) throw new BadRequestException('Invalid profile id');

    return profile;
  }
}
