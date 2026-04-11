import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto, profileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/profile.dto';
import { authUserDto } from 'src/auth/tokens/token.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';

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
    avatar: Express.Multer.File,
  ) {
    const name = profileData.name.toLowerCase();
    const existingProfile = await this.prisma.profile.findUnique({
      where: { name },
    });
    if (existingProfile)
      throw new ForbiddenException(
        'Name already exists. Please provide a new name',
      );

    if (user.profile && user.profile?.length >= 10)
      throw new BadRequestException('You have exceeded Creation of Profile');

    const profile = await this.prisma.profile.create({
      data: {
        userId: user.userId,
        name,
        bio: profileData.bio,
      },
      select: {
        name: true,
        id: true,
      },
    });

    const fileName = `${profile.name}-avatar`; // Extension name is removed because cloudinary considers and stores-> sample.jpg.jpg (So removed)

    const upload = await this.cloudService.uploadedAvatar(avatar, fileName);

    const key = `user:${user.userId}`;
    await this.cacheService.delByPattern(key);

    await this.prisma.profile.updateMany({
      where: { userId: user.userId },
      data: { isActive: false },
    });

    return await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarUrl: upload.secure_url,
        cloudId: upload.public_id,
        isActive: true,
      },
      select: {
        name: true,
        avatarUrl: true,
        isActive: true,
      },
    });
  }

  async updateAvatar(
    profileData: profileDto,
    avatar: Express.Multer.File,
    user: authUserDto,
  ) {
    const profile = await this.prisma.profile.findFirstOrThrow({
      where: { id: profileData.id },
      select: {
        id: true,
        cloudId: true,
        avatarUrl: true,
        name: true,
      },
    });
    const fileName = profile.cloudId!;

    await this.cloudService.updateAvatar(avatar, fileName);

    const key = `user:${user.userId}:profile:${profileData.id}`;
    await this.cacheService.delete(key);

    return {
      id: profile.id,
      avatarUrl: profile.avatarUrl,
      name: profile.name,
    };
  }

  async updateProfile(
    data: UpdateProfileDto,
    profileData: profileDto,
    user: authUserDto,
  ) {
    if (data.name) {
      const existingName = await this.prisma.profile.count({
        where: { name: data.name },
      });
      if (existingName)
        throw new BadRequestException('Profile name already exists');
    }
    const key = `user:${user.userId}:profile:${profileData.id}`;
    await this.cacheService.delete(key);
    return await this.prisma.profile.update({
      where: { id: profileData.id },
      data: {
        bio: data.bio, // removed default to enable user to keep no bio logic
        name: data.name ?? profileData.name,
      },
      select: {
        bio: true,
        name: true,
        id: true,
      },
    });
  }

  async activateProfile(
    user: authUserDto,
    oldProfileData: profileDto,
    newProfileId: string,
  ) {
    if (oldProfileData.id === newProfileId)
      throw new BadRequestException('You cannot reactivate your own profile');
    if (!user.profile?.includes({ id: newProfileId }))
      throw new BadRequestException('No such profile exists for this user');
    const key = `user:${user.userId}`;
    await this.cacheService.delByPattern(key);
    // Such that after this /auth/me should be called -> /auth/me will return all profile id within which active profile frontend will take -> Call to get the profile with his active id
    await this.prisma.profile.updateMany({
      where: { userId: user.userId },
      data: { isActive: false },
    });

    return await this.prisma.profile.update({
      where: { id: newProfileId },
      data: { isActive: true },
      select: {
        name: true,
        isActive: true,
      },
    });
  }

  async getOwnProfile(profile: profileDto, user: authUserDto) {
    const key = `user:${user.userId}:profile:${profile.id}`;
    const cachedProfile = await this.cacheService.get(key);
    if (cachedProfile) return cachedProfile;
    const profileData = await this.prisma.profile.findFirst({
      where: {
        id: profile.id,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        followers: {
          select: {
            id: true,
            follower: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        followings: {
          select: {
            id: true,
            following: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        story: {
          select: {
            id: true,
          },
        },
        sentNotifications: {
          select: {
            id: true,
          },
        },
      },
    });
    await this.cacheService.set<typeof profileData>(key, profileData);
    return profileData;
  }

  async removeProfile(
    currentprofile: profileDto,
    profileId: string,
    user: authUserDto,
  ) {
    if (!user.profile?.includes({ id: profileId }))
      throw new BadRequestException('You are not allowed to delete');

    if (!user.profile?.includes({ id: profileId }))
      throw new BadRequestException(
        'No such profile exists within your registered email',
      );

    if (currentprofile.id === profileId)
      throw new BadRequestException('Deactivate your profile to delete');

    const userKey = `user:${user.userId}`;
    const key = `profile`;
    await this.cacheService.delByPattern(userKey);
    await this.cacheService.delByPattern(key);

    return this.prisma.profile.delete({
      where: { id: profileId },
      select: { name: true },
    });
  }

  async getProfile(profileId: string) {
    const key = `profile:${profileId}`;
    const cachedProfile = await this.cacheService.get(key);
    if (cachedProfile) return cachedProfile;
    const profile = this.prisma.profile.findFirst({
      where: { id: profileId },
      select: {
        avatarUrl: true,
        name: true,
        id: true,
        bio: true,
        // Only story id would be passed if following then only will be allowed
        story: {
          select: {
            id: true,
          },
        },
        posts: {
          select: {
            id: true,
          },
        },
      },
    });
    await this.cacheService.set<typeof profile>(key, profile);
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
      },
      select: {
        id: true,
        avatarUrl: true,
        name: true,
        followers: {
          select: {
            followerId: true,
          },
        },
      },
    });
    await this.cacheService.set<typeof profiles>(key, profiles);
    return profiles;
  }
}
