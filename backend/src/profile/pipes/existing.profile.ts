import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { otherProfileDto } from '../dto/other-prof';

@Injectable()
export class ValidateProfileExists implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(profileId: string): Promise<otherProfileDto> {
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { id: profileId },
      select: {
        id: true,
        userId: true,
        posts: {
          select: {
            id: true,
          },
        },
        story: {
          select: {
            id: true,
          },
        },
      },
    });

    return profile;
  }
}
