import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoryDto } from '../dto/story.usage.dto';

@Injectable()
export class ValidateStoryExists implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(storyId: string): Promise<StoryDto> {
    const story = await this.prisma.story.findFirst({
      where: { id: storyId },
      select: {
        id: true,
        profile: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!story) throw new BadRequestException('No such story exists');
    return {
      id: story.id,
      profileId: story.profile.id,
      storyId: story.id,
    };
  }
}
