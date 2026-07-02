import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProfileDto,
  othersProfile,
  profileDto,
  toggleProf,
} from './dto/profile.dto';
import { UpdateProfileDto } from './dto/profile.dto';
import { authUserDto } from 'src/auth/tokens/token.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';
import { PaginationQueryDto } from 'src/common/pagination/pagination.dto';
import { AvatarProps } from './dto/avatar';
import { otherProfileDto } from './dto/other-prof';
import { StoryService } from 'src/story/story.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
    private cacheService: AppCacheService,
    private storyService: StoryService,
    private postService: PostsService,
  ) {}

  async createProfile(
    user: authUserDto,
    profileData: CreateProfileDto,
    avatar: Express.Multer.File | null,
  ) {
    if (!avatar && !profileData.avatarUrl)
      throw new BadRequestException(' Avtar is required');
    const existingProfile = await this.prisma.profile.findUnique({
      where: { name: profileData.name },
    });
    if (existingProfile)
      throw new BadRequestException(
        'Name already exists. Please provide a new name',
      );

    if (user.profile && user.profile?.length >= 15)
      throw new BadRequestException('You have exceeded Creation of Profile');

    await this.prisma.profile.updateMany({
      data: { isActive: false },
      where: { userId: user.userId },
    });
    const isPrivate = Number(profileData.private);

    const key = `user:${user.userId}`;
    await this.cacheService.delete(key);
    await this.cacheService.delByPattern(`profile:${user.userId}`); // Invalidate all profile-related caches
    await this.cacheService.delByPattern(`posts:global`); // Invalidate global posts feed as new profile might affect visibility

    if (avatar) {
      const fileName = `${profileData.name}-avatar`;
      const uploaded = await this.cloudService.uploadedAvatar(avatar, fileName);
      return await this.prisma.profile.create({
        data: {
          name: profileData.name,
          bio: profileData.bio,
          isActive: true,
          isPrivate: isPrivate ? true : false,
          avatarUrl: uploaded.secure_url,
          cloudId: uploaded.public_id,
          userId: user.userId,
        },
        select: {
          id: true,
        },
      });
    }

    if (profileData.avatarUrl)
      return await this.prisma.profile.create({
        data: {
          name: profileData.name,
          bio: profileData.bio,
          isActive: true,
          isPrivate: isPrivate ? true : false,
          avatarUrl: profileData.avatarUrl,
          userId: user.userId,
        },
        select: {
          id: true,
        },
      });
  }

  async privacyUpdate(profile: profileDto) {
    const key = `profile:${profile.id}`;
    await this.cacheService.delete(key);
    await this.cacheService.delByPattern(`profile`); // Invalidate all profile views due to privacy change
    await this.cacheService.delByPattern(`posts:global`); // Invalidate global posts as privacy affects visibility
    await this.cacheService.delByPattern(`chat:group`);
    return await this.prisma.profile.update({
      where: { id: profile.id },
      data: { isPrivate: !profile.isPrivate },
      select: { isPrivate: true },
    });
  }

  async updateAvatar(
    profileData: profileDto,
    data: AvatarProps,
    user: authUserDto,
  ) {
    if (!data.avatar && !data.avatarUrl)
      throw new BadRequestException('Avatar is required');
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { id: profileData.id },
      select: {
        id: true,
        cloudId: true,
        avatarUrl: true,
        name: true,
      },
    });

    const key = `user:${user.userId}`;
    await this.cacheService.delete(key);
    const profileKey = `profile:${profile.id}`;
    await this.cacheService.delete(profileKey);
    await this.cacheService.delByPattern(`profile`); // Broad invalidation for profile changes

    const publicId = profile.cloudId;
    if (data.avatar) {
      if (publicId) {
        await this.cloudService.updateAvatar(data.avatar, publicId);
        return;
      }
      const fileName = `${crypto.randomUUID()}`;
      const upload = await this.cloudService.uploadedAvatar(
        data.avatar,
        fileName,
      );
      await this.prisma.profile.update({
        where: { id: profile.id },
        data: { avatarUrl: upload.secure_url, cloudId: upload.public_id },
      });
    }
    if (data.avatarUrl) {
      if (publicId) await this.cloudService.delete(publicId);
      await this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          avatarUrl: data.avatarUrl,
          cloudId: null,
        },
      });
    }
    return;
  }

  async updateProfile(
    data: UpdateProfileDto,
    profileData: profileDto,
    user: authUserDto,
  ) {
    if (data.name !== profileData.name) {
      const existingName = await this.prisma.profile.count({
        where: { name: data.name },
      });
      if (existingName) throw new BadRequestException('Name already exists');
    }
    const key = `user:${user.userId}`;
    await this.cacheService.delete(key);
    await this.cacheService.delByPattern(`profile:${profileData.id}`); // Invalidate profile caches
    return await this.prisma.profile.update({
      where: { id: profileData.id },
      data: {
        bio: data.bio,
        name: data.name,
      },
      select: {
        bio: true,
        name: true,
      },
    });
  }

  async activateProfile(
    user: authUserDto,
    oldProfileData: profileDto,
    newProfile: toggleProf,
  ) {
    if (oldProfileData.id === newProfile.id)
      throw new BadRequestException('You cannot reactivate your own profile');
    if (oldProfileData.user.id !== newProfile.userId)
      throw new BadRequestException(
        'This is not your available profile that you can toggle',
      );
    const key = `user:${user.userId}`;
    await this.cacheService.delete(key);

    await this.prisma.profile.updateMany({
      where: { userId: user.userId },
      data: { isActive: false },
    });

    const profileKey = `profile:${oldProfileData.id}`;
    await this.cacheService.delete(profileKey);
    await this.cacheService.delByPattern(`profile:${oldProfileData.id}`); // Invalidate old profile caches
    await this.cacheService.delByPattern(`posts:global`); // Invalidate global posts as active profile changes

    await this.prisma.profile.update({
      where: { id: newProfile.id },
      data: { isActive: true },
      select: {
        name: true,
        isActive: true,
      },
    });
  }

  async getOwnProfile(profile: profileDto) {
    const key = `profile:${profile.id}`;
    const cachedProfile = await this.cacheService.get(key);
    if (cachedProfile) return cachedProfile;
    const profileData = await this.prisma.profile.findUnique({
      where: {
        id: profile.id,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        isPrivate: true,
        avatarUrl: true,
        job: {
          where: {
            NOT: {
              OR: [{ status: 'CANCELLED' }, { status: 'SUCCESS' }],
            },
          },
          select: {
            id: true,
            status: true,
            storyId: true,
            postId: true,
          },
        },
        story: {
          where: {
            isReady: true,
            expiresAt: {
              gt: new Date(Date.now()),
            },
          },
          select: {
            id: true,
          },
        },
        savedPosts: {
          select: {
            postMediaId: true,
          },
        },
        followers: {
          select: {
            followerId: true,
          },
        },
        followings: {
          select: {
            followingId: true,
          },
        },
        _count: {
          select: {
            posts: true,
            //savedPosts: true,
            reels: true,
          },
        },
      },
    });
    await this.cacheService.set<typeof profileData>(
      key,
      profileData,
      1000 * 60 * 20,
    );
    return profileData;
  }

  async removeProfile(
    currentprofile: profileDto,
    otherProfile: otherProfileDto,
    user: authUserDto,
  ) {
    if (user.userId !== otherProfile.userId)
      throw new BadRequestException(
        'No such profile exists within your registered email',
      );

    if (currentprofile.id === otherProfile.id)
      throw new BadRequestException('Active profile cannot be deleted');

    if (otherProfile.story)
      await this.storyService.deleteStory(
        otherProfile.story.id,
        otherProfile.id,
      );

    const removePost = otherProfile.posts.map(async (post) => {
      if (post.id) await this.postService.deletePost(post.id);
    });
    await Promise.all(removePost);

    const userKey = `user:${user.userId}`;
    const key = `profile:${otherProfile.id}`;

    await this.cacheService.delete(userKey);
    await this.cacheService.delete(key);
    await this.cacheService.delByPattern(`profile`);
    await this.cacheService.delByPattern(`posts:global`);

    await this.prisma.profile.delete({
      where: { id: otherProfile.id },
    });
  }

  async getProfile(prof: othersProfile, ownProfile: profileDto) {
    const key = `profile:${ownProfile.id}:${prof.id}:details`; // Standardized key
    //await this.cacheService.delete(key)
    const cachedProfile = await this.cacheService.get(key);
    if (cachedProfile) return cachedProfile;
    const isFollow = await this.prisma.profile.count({
      // To make all data avail only for a follower or a following user  => Later only following profiles be allowed
      where: {
        id: prof.id,
        followers: {
          some: {
            followerId: ownProfile.id,
          },
        },
      },
    });
    const canSeeContent = !prof.isPrivate || !!isFollow;

    const profile = await this.prisma.profile.findUnique({
      where: { id: prof.id },
      select: {
        avatarUrl: true,
        name: true,
        id: true,
        bio: true,
        isPrivate: true,
        chats: {
          select: {
            chatId: true,
          },
          where: {
            chat: {
              members: {
                some: {
                  profileId: ownProfile.id,
                },
              },
              type: 'PRIVATE',
            },
          },
        },
        story: {
          select: {
            ...(isFollow ? { id: true } : { expiresAt: true }),
          },
          where: {
            expiresAt: { gt: new Date() },
            isReady: { equals: true },
          },
        },
        _count: {
          select: {
            followers: true,
            followings: true,
            ...(canSeeContent && {
              posts: true,
              reels: true,
            }),
          },
        },
      },
    });
    await this.cacheService.set<typeof profile>(key, profile, 1000 * 60 * 10);

    return profile;
  }

  async getAllProfile(profile: profileDto, paginatedData: PaginationQueryDto) {
    const page = paginatedData.page ?? 1;
    const limit = paginatedData.limit ?? 10;
    const key = `profile:global:${profile.id}:page:${page}:limit:${limit}`;
    const cachedProfile = await this.cacheService.get(key);
    if (cachedProfile) return cachedProfile;

    const skip = (page - 1) * limit;

    const profiles = await this.prisma.profile.findMany({
      skip,
      take: limit,
      where: {
        NOT: {
          id: profile.id,
        },
        avatarUrl: {
          // Later be removed
          // Kept because of some of my data stored are not proper=> during testing
          not: null,
        },
      },
      select: {
        id: true,
        avatarUrl: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    await this.cacheService.set<typeof profiles>(key, profiles);
    return profiles;
  }
}
