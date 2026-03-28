import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto, profileDto } from './dto/profile.dto';
import { extname } from 'node:path';
import { CloudinaryService } from './cloudinary.service';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
  ) {}

  async createProfile(
    userId: string,
    profileData: CreateProfileDto,
    avatar: Express.Multer.File,
  ) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { name: profileData.name },
    });
    if (existingProfile)
      return new ForbiddenException(
        'Name already exists. Please provide a new name',
      );

    const profile = await this.prisma.profile.create({
      data: {
        userId,
        name: profileData.name,
        bio: profileData.bio,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const ext = extname(avatar.originalname);
    const fileName = `${profile.name}-avatar-${ext}`;

    const upload = await this.cloudService.uploadedAvatar(avatar, fileName);

    await this.prisma.profile.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    return await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarUrl: upload.secure_url, //Url available in cloud
        cloudId: upload.public_id, // Url which will enable us to delete
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        isActive: true,
      },
    });
  }

  async updateAvatar(profileData: profileDto, avatar: Express.Multer.File) {
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

    return {
      id: profile.id,
      avatarUrl: profile.avatarUrl,
      name: profile.name,
    };
  }

  async updateProfile(data: UpdateProfileDto, profileData: profileDto) {
    return await this.prisma.profile.update({
      where: { id: profileData.id },
      data: { bio: data.bio },
      select: {
        bio: true,
        name: true,
        id: true,
      },
    });
  }

  async activateProfile(userId: string, profileData: profileDto) {
    await this.prisma.profile.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    return await this.prisma.profile.update({
      // This should return more data like -> Post, savedPosts, Own Story,   ...
      where: { id: profileData.id },
      data: { isActive: true },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        isActive: true,
      },
    });
  }

  async removeProfile(profileData: profileDto) {
    if (profileData.isActive !== false)
      throw new BadRequestException('Deactivate your profile to delete');

    return this.prisma.profile.delete({
      where: { id: profileData.id },
      select: { name: true },
    });
  }

  async getProfile(profileId: string) {
    return this.prisma.profile.findFirst({
      where: { id: profileId },
      select: {
        avatarUrl: true,
        name: true,
        id: true,
        bio: true,
        // Also story will be sent Frontend will handle if not following, but user cannnot see if he is not folllowing him
        story: {
          select: {
            storyMedia: {
              select: {
                id: true,
              },
            },
          },
        },
        posts: {
          select: {
            id: true,
            postPhoto: {
              select: {
                id: true,
                imageUrl: true,
                order: true,
              },
            },
            likes: {
              select: {
                id: true,
              },
            },
            comments: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
  }

  async allProfiles(userId: string) {
    return this.prisma.profile.findMany({
      where: {
        NOT: {
          userId,
        },
      },
      select: {
        avatarUrl: true,
        name: true,
        id: true,
      },
    });
  }
}
