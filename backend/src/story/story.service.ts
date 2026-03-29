import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryStoryService } from './cloudinary.service';
import { FileValidateDto, StoryMediaType } from './dto/file.type.dto';
import { profileDto } from 'src/profile/dto/profile.dto';
import { Media } from 'src/generated/prisma/enums';

@Injectable()
export class StoryService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryStoryService,
  ) {}

  async createStory(
    files: FileValidateDto,
    fileOrder: string,
    profile: profileDto,
  ) {
    const allFiles = [
      ...(files.image || []),
      ...(files.video || []),
      ...(files.audio || []),
    ];

    const orderSteps = fileOrder.split(',');

    const sortedStoryMedia = orderSteps.map((step) => {
      if (step.includes('+')) {
        const [imgName, audName] = step.split('+');
        return {
          type: 'combined',
          image: allFiles.find((f) => f.originalname === imgName),
          audio: allFiles.find((f) => f.originalname === audName),
        };
      }
      const file = allFiles.find((f) => f.originalname === step);
      return {
        type: file?.mimetype.startsWith('image') ? 'IMG' : 'VIDEO',
        file,
      };
    });

    const story = await this.prisma.story.create({
      data: {
        profileId: profile.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      select: { id: true },
    });
    const profileName = profile.name;

    sortedStoryMedia.forEach((storyMedia) => {
      if (storyMedia.type === 'IMG') { // Should have been handled by prisma Media
        const fileName = crypto.randomUUID();
        const image = storyMedia.file;

        const upload = await this.cloudService.uploadImageStory(
          image!,
          fileName,
          profileName,
        );
      }
      if (storyMedia.type === 'VIDEO') {
      }
      if (storyMedia.type === 'COMBINED') {
      }
    });
  }
}
