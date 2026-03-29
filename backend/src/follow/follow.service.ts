import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async create(profile: profileDto, profileId: string) {
    if (profile.id === profileId)
      throw new BadRequestException(' You cannot follow yourself');

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

  async remove(followId: string) {
    // aslso removal of saved post
    
    return this.prisma.follow.delete({
      where: { id: followId },
      select: { id: true },
    });
  }

  async getFollowers(profileId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: profileId },
      select: {
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
