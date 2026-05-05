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
import { AvatarProps } from './dto/avatar';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
    private cacheService: AppCacheService,
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
            sentNotifications: true,
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
    profileId: string,
    user: authUserDto,
  ) {
    if (!user.profile?.some((p) => p.id === profileId))
      throw new BadRequestException(
        'No such profile exists within your registered email',
      );

    if (currentprofile.id === profileId)
      throw new BadRequestException('Deactivate your profile to delete');

    const userKey = `user:${user.userId}`;
    const key = `profile:${profileId}`;
    await this.cacheService.delete(userKey);
    await this.cacheService.delete(key);

    return this.prisma.profile.delete({
      where: { id: profileId },
      select: { name: true },
    });
  }

  async getProfile(prof: othersProfile, ownProfile: profileDto) {
    const key = `profile:${prof.id}:global:${ownProfile.id}`;
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

    const profile = this.prisma.profile.findUnique({
      where: { id: prof.id },
      select: {
        avatarUrl: true,
        name: true,
        id: true,
        bio: true,
        isPrivate: true,
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
    await this.cacheService.set<typeof profile>(key, profile);
    return profile;
  }

  async getAllProfile(profile: profileDto) {
    const key = `profile:global:${profile.id}`;
    const cachedProfile = await this.cacheService.get(key);
    if (cachedProfile) return cachedProfile;
    const profiles = await this.prisma.profile.findMany({
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
