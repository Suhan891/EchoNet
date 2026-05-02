import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toggleProf } from '../dto/profile.dto';

@Injectable()
export class ValidateToggleProfile implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(profileId: string): Promise<toggleProf> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: { id: true, userId: true },
    });
    if (!profile) throw new BadRequestException('No such profile exists');

    return profile;
  }
}
