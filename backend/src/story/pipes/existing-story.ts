import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoryDto } from '../dto/story.usage.dto';

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
    if (!story) throw new BadGatewayException('No such story exists');
    return story;
  }
}
