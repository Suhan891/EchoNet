import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';
import { Media } from 'src/generated/prisma/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StoryDto, StoryMediaDataDto } from './dto/story.usage.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';
import {
  CacheStatus,
  ImageAudioMedia,
  ImageMedia,
  ParsedSlideDto,
  StoryCreateDto,
  VideoMedia,
} from './dto/story.create.dto';
import { authUserDto } from 'src/auth/tokens/token.dto';

@Injectable()
export class StoryService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
    private readonly eventEmitter: EventEmitter2,
    private cacheService: AppCacheService,
  ) {}

  async createStory(
    slides: ParsedSlideDto[],
    profile: profileDto,
    user: authUserDto,
  ) {
    const existingStory = await this.prisma.story.findFirst({
      where: { profileId: profile.id },
      select: {
        expiresAt: true,
        id: true,
      },
    });

    if (existingStory && existingStory.expiresAt >= new Date(Date.now()))
      throw new BadRequestException(
        'You already have a existing story still not expired',
      );
    if (existingStory && existingStory.expiresAt < new Date(Date.now())) {
      await this.deleteStory(existingStory.id);
    }

    const story = await this.prisma.story.create({
      data: {
        profileId: profile.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      select: {
        id: true,
        expiresAt: true,
      },
    });

    const stories = slides.map((slide) => {
      return {
        storyId: story.id,
        ...slide,
      } as StoryCreateDto;
    });

    this.eventEmitter.emit('story.create', stories);
    const key = `story:${story.id}`;
    await this.cacheService.set<CacheStatus>(
      key,
      'processing',
      1_000 * 60 * 60 * 24,
    );
    const profileKey = `user:${user.userId}:profile:${profile.id}`;
    await this.cacheService.delByPattern(profileKey);
    return {
      status: 'processing',
    };
  }

  async getOwnStory(profile: profileDto) {
    const story = await this.prisma.story.findFirst({
      where: { profileId: profile.id },
      select: { id: true, expiresAt: true },
    });
    if (!story)
      throw new BadRequestException('No story available for this profile');
    if (story && story.expiresAt < new Date(Date.now())) {
      await this.deleteStory(story.id);
      throw new BadRequestException('You story has expired');
    }
    const key = `profile:${profile.id}:story:${story.id}`;
    const cachedStories = await this.cacheService.get(key);
    if (cachedStories) return cachedStories;

    const storyStatKey = `story:${story.id}`;

    const dataUploadStatus = (await this.cacheService.get(
      storyStatKey,
    )) as CacheStatus;
    if (dataUploadStatus) {
      if (dataUploadStatus === 'failed') {
        await this.cacheService.delete(storyStatKey);
        throw new InternalServerErrorException('File Upload Unsuccessfull');
      }
      if (dataUploadStatus === 'processing') return dataUploadStatus;
      if (dataUploadStatus === 'successfull')
        await this.cacheService.delete(storyStatKey);
    }
    const stories = await this.prisma.storyMedia.findMany({
      where: { storyId: story.id },
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
    await this.cacheService.set<typeof stories>(key, stories);
    return stories;
  }

  async getStory(profile: profileDto, story: StoryDto) {
    const key = `profile:${profile.id}:story:${story.id}`;
    const cachedStories = await this.cacheService.get(key);
    if (cachedStories) return cachedStories;
    if (profile.id !== story.profile.id) {
      const existingFollow = await this.prisma.follow.count({
        where: {
          followerId: profile.id,
          followingId: story.profile.id,
        },
      });
      if (!existingFollow)
        throw new BadRequestException(
          'You need to follow before viewing the profile',
        );
    }
    const storyMediaData = await this.prisma.storyMedia.findMany({
      where: { storyId: story.id },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        order: true,
      },
    });
    await this.cacheService.set<typeof storyMediaData>(key, storyMediaData);
    return storyMediaData;
  }

  async getStoryMedia(profile: profileDto, storyMedia: StoryMediaDataDto) {
    const key = `story:${storyMedia.story.id}:meia:${storyMedia.id}:profile:${profile.id}`;
    const cachedStory = await this.cacheService.get(key);
    if (cachedStory) return cachedStory;
    if (profile.id === storyMedia.story.profileId)
      return this.OwnStory(storyMedia, key);
    const profileId = profile.id;
    return this.OthersStory(profileId, storyMedia, key);
  }
  async createImageMedia(data: ImageMedia) {
    const fileName = `${crypto.randomUUID()}-${data.order}`;
    const uploaded = await this.cloudService.uploadImageStory(
      data.imageFile,
      fileName,
    );
    await this.prisma.storyMedia.create({
      data: {
        mediaType: Media.IMG,
        mediaUrl: uploaded.secure_url,
        cloudId: uploaded.public_id,
        order: data.order,
        storyId: data.storyId,
      },
    });
  }
  async createVideoMedia(data: VideoMedia) {
    const fileName = `${crypto.randomUUID()}-${data.order}`;
    const uploaded = await this.cloudService.uploadVideoStory(
      data.videoFile,
      fileName,
    );
    await this.prisma.storyMedia.create({
      data: {
        mediaType: Media.VIDEO,
        mediaUrl: uploaded.secure_url,
        cloudId: uploaded.public_id,
        order: data.order,
        storyId: data.storyId,
      },
    });
  }
  async createImageAudioMedia(data: ImageAudioMedia) {
    const imgFileName = crypto.randomUUID();
    const uploadedImg = await this.cloudService.uploadImageStory(
      data.imageFile,
      imgFileName,
    );
    const fileName = `${crypto.randomUUID()}-${data.order}`;
    return await this.cloudService.uploadAudioAndMerge(
      data.audioFile,
      uploadedImg.public_id,
      fileName,
    );
  }

  // async createStoryMedia(request: CreateStoryMediaEvent) {
  //   const { sortedStoryMedia, profileName, storyId } = request;
  //   const uploadPromise = sortedStoryMedia.map(async (item) => {
  //     let order = 1;
  //     if (item.type === StoryMediaType.IMAGE) {
  //       const file = item.file as Express.Multer.File;
  //       const fileName = `${crypto.randomUUID()}-${order}`;
  //       return await this.cloudService.uploadImageStory(file, fileName);
  //     }
  //     if (item.type === StoryMediaType.VIDEO) {
  //       const file = item.file as Express.Multer.File;
  //       const fileName = `${crypto.randomUUID()}-${order}`;
  //       return await this.cloudService.uploadVideoStory(file, fileName);
  //     }
  //     if (item.type === StoryMediaType.COMBINED) {
  //       const image = item.image as Express.Multer.File;
  //       const imgFileName = crypto.randomUUID();
  //       const imgUpload = await this.cloudService.uploadImageStory(
  //         image,
  //         imgFileName,
  //       );

  //       const audioFile = item.audio as Express.Multer.File;
  //       const imgPublicId = imgUpload.public_id;
  //       const fileName = `${crypto.randomUUID()}-${order}`;
  //       return await this.cloudService.uploadAudioAndMerge(
  //         audioFile,
  //         imgPublicId,
  //         fileName,
  //       );
  //     }
  //     order++;
  //   });
  //   const uploads = await Promise.all(uploadPromise);
  //   if (!uploads)
  //     throw new InternalServerErrorException('No uploaded file returned');
  //   if (uploads.length !== sortedStoryMedia.length)
  //     throw new InternalServerErrorException('All the files were not returned');

  //   const createStoryMediaPromise = uploads.map(async (upload) => {
  //     if (upload)
  //       return await this.prisma.storyMedia.create({
  //         data: {
  //           cloudId: upload.public_id,
  //           mediaUrl: upload.secure_url,
  //           mediaType:
  //             upload.resource_type === 'image' ? Media.IMG : Media.VIDEO,
  //           storyId,
  //         },
  //         select: {
  //           id: true,
  //           mediaUrl: true,
  //           mediaType: true,
  //         },
  //       });
  //   });

  //   return await Promise.all(createStoryMediaPromise);
  // }

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
        await this.cloudService.delete(publicId);
      }
    });
    await Promise.all(deletePromises);

    const story = await this.prisma.story.delete({
      where: { id: storyId },
      select: { id: true },
    });

    const key = `story:${storyId}`;
    await this.cacheService.delByPattern(key);

    return story.id;
  }

  private async OwnStory(storyMedia: StoryMediaDataDto, key: string) {
    const storyMediaData = await this.prisma.storyMedia.findFirst({
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
    await this.cacheService.set<typeof storyMediaData>(key, storyMediaData);
  }

  private async OthersStory(
    profileId: string,
    storyMedia: StoryMediaDataDto,
    key: string,
  ) {
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

    const storyMediaData = await this.prisma.storyMedia.findFirst({
      where: { id: storyMedia.id },
      select: {
        mediaType: true,
        mediaUrl: true,
        order: true,
      },
    });
    await this.cacheService.set<typeof storyMediaData>(key, storyMediaData);
  }
}
