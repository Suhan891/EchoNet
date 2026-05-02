import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { othersProfile } from '../dto/profile.dto';

@Injectable()
export class ValidateOthersProfile implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(profileId: string): Promise<othersProfile> {
    const profile = await this.prisma.profile.findFirst({
      where: { id: profileId },
      select: { id: true, isPrivate: true },
    });
    if (!profile) throw new BadRequestException('No such profile exists');

    return profile;
  }
}
