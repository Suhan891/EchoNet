import { BadGatewayException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoryMediaDataDto } from '../dto/story.usage.dto';

export class ValidateStoryMediaPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(storyMediaId: string): Promise<StoryMediaDataDto> {
    const storyMedia = await this.prisma.storyMedia.findFirst({
      where: { id: storyMediaId },
      select: {
        id: true,
        mediaType: true,
        mediaUrl: true,
        story: {
          select: {
            id: true,
            profileId: true,
          },
        },
      },
    });
    if (!storyMedia)
      throw new BadGatewayException('No such story Media exists');
    return storyMedia;
  }
}
