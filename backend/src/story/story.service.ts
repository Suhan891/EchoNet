import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';
import { JobName, JobStatus, Media } from 'src/generated/prisma/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StoryDto } from './dto/story.usage.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';
import {
  CacheStatus,
  ImageAudioMedia,
  ImageMedia,
  ParsedSlideDto,
  StoryCreateDto,
  StoryCreateEvent,
  VideoMedia,
} from './dto/story.create.dto';
import { authUserDto } from 'src/auth/tokens/token.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class StoryService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
    private readonly eventEmitter: EventEmitter2,
    private cacheService: AppCacheService,
    private notificationService: NotificationService,
  ) {}

  async createStory(
    slides: ParsedSlideDto[],
    profile: profileDto,
    user: authUserDto,
  ) {
    const existingStory = await this.prisma.story.findUnique({
      where: { profileId: profile.id },
      select: {
        expiresAt: true,
        id: true,
      },
    });
    if (existingStory) await this.deleteStory(existingStory.id, profile.id);

    // if (existingStory && existingStory.expiresAt >= new Date(Date.now()))
    //   throw new BadRequestException(
    //     'You already have a existing story still not expired',
    //   );
    // if (existingStory && existingStory.expiresAt < new Date(Date.now())) {
    //   await this.deleteStory(existingStory.id, profile.id);
    // }

    const story = await this.prisma.story.create({
      data: {
        profileId: profile.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isReady: false,
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

    const eventData = {
      stories,
      storyId: story.id,
      profileId: profile.id,
      name: profile.name,
    } as StoryCreateEvent;

    const jobId = (await this.eventEmitter.emitAsync(
      'story.create',
      eventData,
    )) as string[];

    const profileKey = `profile:${profile.id}`;
    await this.cacheService.delete(profileKey);
    await this.cacheService.delByPattern(`story:${profile.id}`); // Invalidate all story caches for profile
    return await this.prisma.job.create({
      data: {
        userId: user.userId,
        jobId: jobId[0],
        name: JobName.STORY,
        status: JobStatus.PROGRESS,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }

  async removeStory(profile: profileDto) {
    const story = await this.prisma.story.findFirst({
      where: { profileId: profile.id },
      select: { id: true },
    });
    if (!story)
      throw new BadRequestException('No story wxists for the profile');

    await this.deleteStory(story.id, profile.id);
    const profileKey = `profile:${profile.id}`;
    await this.cacheService.delete(profileKey);
  }

  async getOwnStory(profile: profileDto) {
    const story = await this.prisma.story.findFirst({
      where: { profileId: profile.id },
      select: { id: true, expiresAt: true },
    });
    if (!story)
      throw new BadRequestException('No story available for this profile');
    if (story && story.expiresAt < new Date(Date.now())) {
      await this.deleteStory(story.id, profile.id);
      throw new BadRequestException('You story has expired');
    }
    const key = `story:${profile.id}:own:${story.id}`;
    const cachedStories = await this.cacheService.get(key);
    if (cachedStories) return cachedStories;

    const storyStatKey = `story:${story.id}`;

    const dataUploadStatus = (await this.cacheService.get(
      storyStatKey,
    )) as CacheStatus;
    if (dataUploadStatus) {
      if (dataUploadStatus === 'failed') {
        await this.cacheService.delete(storyStatKey);
        await this.prisma.story.delete({
          where: { id: story.id },
        });
        throw new InternalServerErrorException('File Upload Unsuccessfull');
      }
      if (dataUploadStatus === 'processing') return dataUploadStatus;
      if (dataUploadStatus === 'successfull')
        await this.cacheService.delete(storyStatKey);
    }
    const stories = await this.prisma.storyMedia.findMany({
      where: { storyId: story.id },
      select: {
        id: true,
        mediaType: true,
        mediaUrl: true,
        duration: true,
        order: true, // later be removed => Instead order by created at
        // likes: {
        //   select: {
        //     id: true,
        //     profileId: true,
        //   },
        // },
        // storyViews: {
        //   select: {
        //     id: true,
        //     viewer: {
        //       select: {
        //         name: true,
        //         avatarUrl: true,
        //       },
        //     },
        //   },
        // },
        _count: {
          select: {
            likes: true,
            storyViews: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
    await this.cacheService.set<typeof stories>(key, stories);
    return stories;
  }

  async getStory(profile: profileDto, story: StoryDto) {
    const key = `story:${story.profileId}:${story.id}`;
    const cachedStories = await this.cacheService.get(key);
    if (cachedStories) return cachedStories;
    if (profile.id !== story.profileId)
      await this.ValidateProfile(profile.id, story.profileId);

    const storyMediaData = await this.prisma.storyMedia.findMany({
      where: { storyId: story.id },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
      },
    });
    const storiesIds = [...storyMediaData.map((media) => media.id)];
    await this.cacheService.set<typeof storiesIds>(key, storiesIds, 60 * 30);
    return storiesIds;
  }

  async getStoryMedia(profile: profileDto, storyMedia: StoryDto) {
    const isOwn = profile.id === storyMedia.profileId;
    if (!isOwn) await this.ValidateProfile(profile.id, storyMedia.profileId);

    const key = `story:${storyMedia.storyId}:${storyMedia.id}`;
    const cachedStory = await this.cacheService.get(key);
    if (cachedStory) return cachedStory;

    const story = await this.prisma.storyMedia.findUnique({
      where: { id: storyMedia.id },
      select: {
        id: true,
        mediaType: true,
        mediaUrl: true,
        duration: true,
        ...(isOwn && {
          _count: {
            select: {
              storyViews: true,
              likes: true,
            },
          },
        }),
      },
    });
    await this.cacheService.set<typeof story>(key, story, 60 * 30);
    return story;
  }

  private async ValidateProfile(profileId: string, storyOwnerId: string) {
    await this.prisma.follow.findUniqueOrThrow({
      where: {
        followerId_followingId: {
          followerId: profileId,
          followingId: storyOwnerId,
        },
      },
    });
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
        duration: uploaded.duration,
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
    const uploaded = await this.cloudService.uploadAudioAndMerge(
      data.audioFile,
      uploadedImg.public_id,
      fileName,
    );
    await this.prisma.storyMedia.create({
      data: {
        mediaType: Media.COMBINED,
        mediaUrl: uploaded.secure_url,
        duration: uploaded.duration,
        cloudId: uploaded.public_id,
        order: data.order,
        storyId: data.storyId,
      },
    });
  }

  async deleteStory(storyId: string, profileId: string): Promise<string> {
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
    await this.cacheService.delete(key);

    await this.cacheService.delByPattern(`story:${storyId}`);
    await this.cacheService.delete(`story:${profileId}:${story.id}`);

    await this.notificationService.clearNotifyCacheOfFollowers(profileId);
    return story.id;
  }

  // private async OwnStory(storyMedia: StoryMediaDataDto, key: string) {
  //   const storyMediaData = await this.prisma.storyMedia.findUnique({
  //     where: { id: storyMedia.id },
  //     select: {
  //       mediaType: true,
  //       mediaUrl: true,
  //       order: true,
  //       duration: true,
  //       likes: {
  //         select: {
  //           id: true,
  //           profileId: true,
  //         },
  //       },
  //       storyViews: {
  //         select: {
  //           id: true,
  //           viewer: {
  //             select: {
  //               name: true,
  //               avatarUrl: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   await this.cacheService.set<typeof storyMediaData>(key, storyMediaData);
  // }

  // private async OthersStory(
  //   profileId: string,
  //   storyMedia: StoryMediaDataDto,
  //   key: string,
  // ) {
  //   const existingStoryView = await this.prisma.storyViews.count({
  //     where: { storyMediaId: storyMedia.id, viewerId: profileId },
  //   });

  //   if (!existingStoryView) {
  //     const payload = {
  //       storyMediaId: storyMedia.id,
  //       viewerId: profileId,
  //     };
  //     this.eventEmitter.emit('story.view', payload);
  //   }

  //   const storyMediaData = await this.prisma.storyMedia.findFirst({
  //     where: { id: storyMedia.id },
  //     select: {
  //       mediaType: true,
  //       mediaUrl: true,
  //       order: true,
  //     },
  //   });
  //   await this.cacheService.set<typeof storyMediaData>(key, storyMediaData);
  // }
}
