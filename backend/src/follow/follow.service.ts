import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';
import { followDto } from './dto/validate-follow.dto';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async create(profile: profileDto, profileId: string) {
    if (profile.id === profileId)
      throw new BadRequestException('You cannot follow yourself');

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: profile.id,
          followingId: profileId,
        },
      },
      select: {
        id: true,
      },
    });
    if (existingFollow) throw new BadRequestException('Follow already exists');

    return await this.prisma.follow.create({
      data: {
        followerId: profile.id,
        followingId: profileId,
      },
      select: {
        id: true,
      },
    });
  }

  async remove(follow: followDto) {
    await this.existingSavePost(follow);

    return await this.prisma.follow.delete({
      where: { id: follow.followerId },
      select: { id: true },
    });
  }

  private async existingSavePost(follow: followDto) {
    const savedPosts = await this.prisma.savePost.findMany({
      where: {
        profileId: follow.followerId,
      },
      select: {
        id: true,
        post: {
          select: {
            post: {
              select: {
                profileId: true,
              },
            },
          },
        },
      },
    });
    if (!savedPosts) return;

    const existingsavePostOfFollowing = savedPosts.map(async (posts) => {
      const profileId = posts.post.post.profileId;

      if (profileId === follow.followingId) {
        await this.prisma.savePost.delete({
          where: {
            id: posts.id,
          },
        });
      }
    });

    await Promise.all(existingsavePostOfFollowing);
  }

  async getFollowers(profileId: string) {
    return await this.prisma.follow.findMany({
      where: { followingId: profileId },
      select: {
        id: true,
        followerId: true,
        follower: {
          select: {
            avatarUrl: true,
            name: true,
          },
        },
      },
    });
  }

  async getFollowings(profileId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: profileId },
      select: {
        id: true,
        followingId: true,
        following: {
          select: {
            avatarUrl: true,
            name: true,
          },
        },
      },
    });
  }
}
