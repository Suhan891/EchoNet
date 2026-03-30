import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryStoryService } from './cloudinary.service';
import {
  StoryMediaDto,
  FileValidateDto,
  StoryMediaType,
  CreateStoryMediaEvent,
} from './dto/file.type.dto';
import { profileDto } from 'src/profile/dto/profile.dto';
import { Media } from 'src/generated/prisma/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StoryMediaDataDto } from './dto/story.usage.dto';

@Injectable()
export class StoryService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryStoryService,
    private readonly eventEmitter: EventEmitter2,
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
    let totalFiles = orderSteps.length;

    const sortedStoryMedia: StoryMediaDto[] = orderSteps.map((step) => {
      if (step.includes('+')) {
        const [imgName, audName] = step.split('+');
        totalFiles++;
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

    if (
      allFiles.length !== totalFiles ||
      sortedStoryMedia.length !== totalFiles
    )
      throw new BadRequestException(
        'All the files with correct name were not provided',
      );

    const existingStory = await this.prisma.story.findFirst({
      where: { profileId: profile.id },
      select: { expiresAt: true, id: true },
    });
    if (
      existingStory?.expiresAt &&
      existingStory.expiresAt > new Date(Date.now())
    )
      throw new BadRequestException('Story already exists');

    if (
      existingStory?.expiresAt &&
      existingStory.expiresAt < new Date(Date.now())
    ) {
      const storyIdEvent = existingStory?.id;
      // const res = await this.eventEmitter.emitAsync(
      //   'story.delete',
      //   storyIdEvent,
      // );
      // if (!res)
      //   throw new InternalServerErrorException(
      //     'Job of deletion did not proceed',
      //   );
      await this.deleteStory(storyIdEvent);
    }

    const story = await this.prisma.story.create({
      data: {
        profileId: profile.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      select: { id: true, expiresAt: true },
    });
    const profileName = profile.name;
    const storyId = story.id;

    const payload: CreateStoryMediaEvent = {
      sortedStoryMedia,
      profileName,
      storyId,
    };

    this.eventEmitter.emit('story-media.create', payload);

    return {
      storyId: story.id,
      stories: totalFiles,
    };
  }

  async getStoryMedia(profile: profileDto, storyMedia: StoryMediaDataDto) {
    if (profile.id === storyMedia.story.profileId)
      return this.OwnStory(storyMedia);
    const profileId = profile.id;
    return this.OthersStory(profileId, storyMedia);
  }

  async createStoryMedia(request: CreateStoryMediaEvent) {
    const { sortedStoryMedia, profileName, storyId } = request;
    const uploadPromise = sortedStoryMedia.map(async (item) => {
      let order = 1;
      if (item.type === StoryMediaType.IMAGE) {
        const file = item.file as Express.Multer.File;
        const fileName = `${crypto.randomUUID()}-${order}`;
        return await this.cloudService.uploadImageStory(
          file,
          fileName,
          profileName,
        );
      }
      if (item.type === StoryMediaType.VIDEO) {
        const file = item.file as Express.Multer.File;
        const fileName = `${crypto.randomUUID()}-${order}`;
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
        const fileName = `${crypto.randomUUID()}-${order}`;
        return await this.cloudService.uploadAudioAndMerge(
          audioFile,
          imgPublicId,
          fileName,
          profileName,
        );
      }
      order++;
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

  async deleteStory(storyId: string): Promise<string> {
    const storyMedias = await this.prisma.storyMedia.findMany({
      where: { storyId },
      select: {
        cloudId: true,
      },
    });

    const deletePromises = storyMedias.map(async (media) => {
      const publicId = media.cloudId;

      if (publicId) {
        await this.cloudService.deleteStory(publicId);
      }
    });
    await Promise.all(deletePromises);

    const story = await this.prisma.story.delete({
      where: { id: storyId },
      select: { id: true },
    });
    return story.id;
  }

  private async OwnStory(storyMedia: StoryMediaDataDto) {
    return await this.prisma.storyMedia.findFirst({
      where: { id: storyMedia.id },
      select: {
        mediaType: true,
        mediaUrl: true,
        order: true,
        likes: {
          select: {
            id: true,
            profileId: true,
          },
        },
        storyViews: {
          select: {
            id: true,
            viewer: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  private async OthersStory(profileId: string, storyMedia: StoryMediaDataDto) {
    const existingStoryView = await this.prisma.storyViews.count({
      where: { storyMediaId: storyMedia.id, viewerId: profileId },
    });

    if (!existingStoryView) {
      const payload = {
        storyMediaId: storyMedia.id,
        viewerId: profileId,
      };
      this.eventEmitter.emit('story.view', payload);
    }

    return await this.prisma.storyMedia.findFirst({
      where: { id: storyMedia.id },
      select: {
        mediaType: true,
        mediaUrl: true,
        order: true,
      },
    });
  }
}
