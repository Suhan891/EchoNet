import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';
import { followDto, FollowFromProfileDto } from './dto/validate-follow.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';

@Injectable()
export class FollowService {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
  ) {}

  async toggleFollow(othersProf: FollowFromProfileDto, profile: profileDto) {
    const existingFollow = othersProf.followers.some(
      (otherP) => otherP.followerId === profile.id,
    );
    if (existingFollow)
      return await this.remove({
        followerId: profile.id,
        followingId: othersProf.id,
      });
    return await this.create(profile, othersProf.id);
  }

  private async create(profile: profileDto, profileId: string) {
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

    await this.prisma.follow.create({
      data: {
        followerId: profile.id,
        followingId: profileId,
      },
    });

    await this.cacheService.delete(`follow:${profile.id}:following`);
    await this.cacheService.delete(`follow:${profileId}:followers`);

    await this.cacheService.delete(`profile:${profile.id}`);
    await this.cacheService.delete(`profile:${profileId}`);
    await this.cacheService.delByPattern(`posts:global`);
  }

  private async remove(follow: followDto) {
    await this.cacheService.delete(`follow:${follow.followerId}:following`);
    await this.cacheService.delete(`follow:${follow.followingId}:followers`);

    // Then handle saved posts cleanup
    await this.existingSavePost(follow);

    const result = await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: follow.followerId,
          followingId: follow.followingId,
        },
      },
      select: { id: true },
    });

    await this.cacheService.delete(`profile:${follow.followerId}`);
    await this.cacheService.delByPattern(`posts:global`);

    return result;
  }

  private async existingSavePost(follow: followDto) {
    const savedPosts = await this.prisma.savePost.findMany({
      where: {
        profileId: follow.followerId,
        post: {
          post: {
            profileId: follow.followingId,
          },
        },
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

    const key = `profile:${follow.followerId}:saved-posts`;
    await this.cacheService.delete(key);

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

  async getFollow(profileId: string, follow: 'FOLLOWERS' | 'FOLLOWING') {
    const key = `follow:${profileId}:${follow.toLowerCase()}`;
    const catchedFollow = await this.cacheService.get(key);
    if (catchedFollow) return catchedFollow;
    const isFollowers = follow === 'FOLLOWERS';
    const isFollowing = follow === 'FOLLOWING';

    const data = await this.prisma.follow.findMany({
      where: {
        followingId: isFollowers ? profileId : undefined,
        followerId: isFollowing ? profileId : undefined,
      },
      select: {
        id: true,
        ...(isFollowers && {
          follower: {
            select: {
              id: true,
              avatarUrl: true,
              name: true,
            },
          },
        }),
        ...(isFollowing && {
          following: {
            select: {
              id: true,
              avatarUrl: true,
              name: true,
            },
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
    await this.cacheService.set<typeof data>(key, data, 1000 * 60 * 10);
    return data;
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
