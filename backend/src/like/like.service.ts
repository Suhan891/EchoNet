import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestDto, RequestType, ResLikeDto } from './dto/request.dto';
import { profileDto } from 'src/profile/dto/profile.dto';
import { AppCacheService } from 'src/common/caching/redis.cache';

@Injectable()
export class LikeService {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
  ) {}

  async toggleLike(data: ResLikeDto, profile: profileDto) {
    await this.cacheService.delete(`likes:${profile.id}`);
    if (data.name === 'POST') {
      await this.cacheService.delByPattern(`posts:global:${profile.id}`); // Invalidate global feeds
      await this.cacheService.delByPattern(`profile:${profile.id}`); // Invalidate post views
    }
    if (!data.likeId) return this.create(data);
    return this.remove(profile, data.likeId);
  }

  async viewProfiles(profile: profileDto, id: string, type: RequestType) {
    const key = `likes:${profile.id}`;
    const cachedProfiles = await this.cacheService.get(key);
    if (cachedProfiles) return cachedProfiles;

    const isValid = await this.validateId(profile.id, id, type);
    if (!isValid) throw new BadRequestException('Invalid credentials');

    const likes = await this.prisma.likes.findMany({
      where: {
        storyMediaId: type === 'STORY' ? id : undefined,
        postId: type === 'POST' ? id : undefined,
        reelId: type === 'REEL' ? id : undefined,
      },
      select: {
        profile: {
          select: {
            id: true,
            avatarUrl: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });
    if (!likes) throw new BadRequestException('No like exists');
    await this.cacheService.set<typeof likes>(key, likes);
    return likes;
  }

  private async create(data: RequestDto) {
    if (data.name === 'POST') return await this.createPostLike(data);
    if (data.name === 'REEL') return await this.createReelLike(data);
    if (data.name === 'STORY') return await this.createStoryLike(data);
  }

  private async remove(profile: profileDto, likeId: string) {
    // All of them later shall face cache invalidation => later
    await this.prisma.likes.delete({
      where: { id: likeId },
      select: { id: true },
    });
  }

  private async validateId(
    profileId: string,
    id: string,
    type: RequestType,
  ): Promise<boolean> {
    if (type === 'STORY') {
      const count = await this.prisma.storyMedia.count({
        where: {
          story: {
            profileId: profileId,
          },
          id: id,
        },
      });
      if (count) return true;
    }
    if (type === 'REEL') {
      const count = await this.prisma.reel.count({
        where: {
          profileId,
          id: id,
        },
      });
      if (count) return true;
    }
    if (type === 'POST') {
      const count = await this.prisma.post.count({
        where: {
          profileId,
          id: id,
        },
      });
      if (count) return true;
    }
    return false;
  }

  private async createPostLike(data: RequestDto) {
    // Redis invalidation logic => later
    return await this.prisma.likes.create({
      data: {
        profileId: data.profileId,
        postId: data.id,
      },
      select: {
        id: true,
      },
    });
  }

  private async createReelLike(data: RequestDto) {
    return await this.prisma.likes.create({
      data: {
        profileId: data.profileId,
        reelId: data.id,
      },
      select: {
        id: true,
      },
    });
  }

  private async createStoryLike(data: RequestDto) {
    return await this.prisma.likes.create({
      data: {
        profileId: data.profileId,
        storyMediaId: data.id,
      },
      select: {
        id: true,
      },
    });
  }
}
