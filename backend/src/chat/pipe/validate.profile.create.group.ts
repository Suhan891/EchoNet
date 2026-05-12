import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfGroupDto } from '../dto/chat.dto';

@Injectable()
export class ValidateGroupPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(profileId: string): Promise<ProfGroupDto> {
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { id: profileId },
      select: {
        id: true,
        isPrivate: true,
      },
    });
    return {
      profileId: profile.id,
      isPrivate: profile.isPrivate,
    };
  }
}
