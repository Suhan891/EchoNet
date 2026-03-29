import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryStoryService } from './cloudinary.service';
import {
  StoryMediaDto,
  FileValidateDto,
  StoryMediaType,
} from './dto/file.type.dto';
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

    const sortedStoryMedia: StoryMediaDto[] = orderSteps.map((step) => {
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
        type: file?.mimetype.startsWith('image') ? 'image' : 'video',
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
    const storyId = story.id;
    const result = await this.createStoryMedia(
      sortedStoryMedia,
      profileName,
      storyId,
    );

    if (!result)
      throw new InternalServerErrorException(
        'No Story Media Creation data returned returned',
      );

    return {
      storyId: story.id,
      storyMedia: result,
    };
  }

  private async createStoryMedia(
    sortedStoryMedia: StoryMediaDto[],
    profileName: string,
    storyId: string,
  ) {
    const uploadPromise = sortedStoryMedia.map(async (item) => {
      if (item.type === StoryMediaType.IMAGE) {
        const file = item.file as Express.Multer.File;
        const fileName = crypto.randomUUID();
        return await this.cloudService.uploadImageStory(
          file,
          fileName,
          profileName,
        );
      }
      if (item.type === StoryMediaType.VIDEO) {
        const file = item.file as Express.Multer.File;
        const fileName = crypto.randomUUID();
        return await this.cloudService.uploadVideoStory(
          file,
          fileName,
          profileName,
        );
      }
      if (item.type === StoryMediaType.COMBINED) {
        const image = item.image as Express.Multer.File;
        const imgFileName = crypto.randomUUID();
        const imgUpload = await this.cloudService.uploadImageStory(
          image,
          imgFileName,
          profileName,
        );

        const audioFile = item.audio as Express.Multer.File;
        const imgPublicId = imgUpload.public_id;
        const fileName = crypto.randomUUID();
        return await this.cloudService.uploadAudioAndMerge(
          audioFile,
          imgPublicId,
          fileName,
          profileName,
        );
      }
    });
    const uploads = await Promise.all(uploadPromise);
    if (!uploads)
      throw new InternalServerErrorException('No uploaded file returned');
    if (uploads.length !== sortedStoryMedia.length)
      throw new InternalServerErrorException('All the files were not returned');

    const createStoryMediaPromise = uploads.map(async (upload) => {
      if (upload)
        return await this.prisma.storyMedia.create({
          data: {
            cloudId: upload.public_id,
            mediaUrl: upload.secure_url,
            mediaType:
              upload.resource_type === 'image' ? Media.IMG : Media.VIDEO,
            storyId,
          },
          select: {
            id: true,
            mediaUrl: true,
            mediaType: true,
          },
        });
    });

    return await Promise.all(createStoryMediaPromise);
  }
}
