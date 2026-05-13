import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoryDto } from '../dto/story.usage.dto';

@Injectable()
export class ValidateStoryMediaPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(storyMediaId: string): Promise<StoryDto> {
    const storyMedia = await this.prisma.storyMedia.findUnique({
      where: { id: storyMediaId },
      select: {
        id: true,
        story: {
          select: {
            id: true,
            profileId: true,
          },
        },
      },
    });
    if (!storyMedia)
      throw new BadRequestException('No such story Media exists');
    return {
      id: storyMedia.id,
      storyId: storyMedia.story.id,
      profileId: storyMedia.story.profileId,
    };
  }
}
