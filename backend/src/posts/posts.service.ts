import { BadRequestException, Injectable } from '@nestjs/common';
import { profileDto } from 'src/profile/dto/profile.dto';
import { CreatePostDto, PostEvent } from './dto/create.post';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { OthersPostDto, PostDto, SavePostDto } from './dto/posts.dto';
import { FindPostQueryDto } from './dto/pagination-filtering.dto';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JobName, JobStatus } from 'src/generated/prisma/enums';
import { OthersPost } from './dto/result';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
    private cacheService: AppCacheService,
    private eventEmitter: EventEmitter2,
  ) {}
  async createPost(
    profile: profileDto,
    data: CreatePostDto,
    postMedia: Array<Express.Multer.File>,
  ) {
    const posts = await this.prisma.post.findMany({
      where: { profileId: profile.id },
      select: { id: true },
    });

    if (posts && posts.length >= 10)
      throw new BadRequestException('Post limit has exceeded');

    const post = await this.prisma.post.create({
      data: {
        profileId: profile.id,
        caption: data.caption,
        isReady: false,
      },
      select: {
        id: true,
        caption: true,
        profile: {
          select: {
            id: true,
          },
        },
      },
    });

    const eventData = {
      postId: post.id,
      profileId: post.profile.id,
      medias: postMedia,
      name: profile.name,
    } as PostEvent;

    const jobId = (await this.eventEmitter.emitAsync(
      'posts.create',
      eventData,
    )) as string[];

    const key = `profile:${profile.id}`;
    await this.cacheService.delete(key);
    await this.cacheService.delByPattern(`posts:global`);

    return await this.prisma.job.create({
      data: {
        profileId: profile.id,
        jobId: jobId[0],
        name: JobName.POST,
        status: JobStatus.PROGRESS,
        postId: post.id,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }

  async createMedia(postId: string, media: Express.Multer.File) {
    const filename = `${crypto.randomUUID()}`;
    const uploaded = await this.cloudService.uploadPost(media, filename);
    await this.prisma.postMedia.create({
      data: {
        postId,
        cloudId: uploaded.public_id,
        mediaUrl: uploaded.secure_url,
      },
    });
  }

  async getOwnPosts(profile: profileDto) {
    const key = `profile:${profile.id}:${profile.id}:posts`;
    const catchedPosts = await this.cacheService.get(key);
    if (catchedPosts) return catchedPosts;
    const posts = await this.prisma.post.findMany({
      where: { profileId: profile.id },
      select: {
        id: true,
        caption: true,
        description: true,
        postPhoto: {
          select: {
            id: true,
            mediaUrl: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    await this.cacheService.set<typeof posts>(key, posts, 1000 * 60 * 10);
    console.log('Without cached: ,Own post data:', posts);
    return posts;
  }

  async removePosts(profile: profileDto, post: PostDto) {
    if (post.profileId !== profile.id)
      throw new BadRequestException('You are not allowed to remove');

    await this.deletePost(post.id);
    await this.cacheService.delete(`profile:${profile.id}`);
  }

  async deletePost(postId: string) {
    const postMedias = await this.prisma.postMedia.findMany({
      where: { id: postId },
      select: { cloudId: true },
    });
    const postPrmomise = postMedias.map(async (media) => {
      const publicId = media.cloudId;
      await this.cloudService.delete(publicId);
    });
    await Promise.all(postPrmomise);
    await this.prisma.post.delete({
      where: { id: postId },
    });
    await this.cacheService.delByPattern(`posts:global`);
  }

  async getOthersPost(othersProf: OthersPostDto, profile: profileDto) {
    const key = `profile:${profile.id}:${othersProf.id}:posts`;
    //await this.cacheService.delete(key);
    const cachedPosts = await this.cacheService.get<OthersPost[]>(key);
    if (cachedPosts) return cachedPosts;
    if (othersProf.id === profile.id)
      throw new BadRequestException(' Invalid profile id for this route ');

    if (othersProf.isPrivate) {
      const following = await this.prisma.follow.count({
        where: {
          followerId: profile.id,
          followingId: othersProf.id,
        },
      });
      if (!following)
        throw new BadRequestException('Follow to view the profile');
    }
    const posts = await this.prisma.post.findMany({
      where: { profileId: othersProf.id },
      select: {
        id: true,
        caption: true,
        description: true,
        likes: {
          select: {
            profileId: true,
          },
        },
        postPhoto: {
          select: {
            id: true,
            mediaUrl: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    await this.cacheService.set<typeof posts>(key, posts, 1000 * 60);
    return posts;
  }

  async getAllPost(profile: profileDto, paginatedData: FindPostQueryDto) {
    const page = paginatedData.page ?? 1;
    const limit = paginatedData.limit ?? 10;
    const key = `posts:global:${profile.id}:page:${page}:limit:${limit}`;
    const cachedPosts = await this.cacheService.get(key);
    const isFiltering = !!paginatedData.name;
    if (cachedPosts && !isFiltering) return cachedPosts;

    const skip = (page - 1) * limit;
    let totalPosts = 0;
    if (!isFiltering) {
      totalPosts = await this.prisma.post.count({
        where: {
          NOT: {
            profileId: profile.id,
          },
        },
      });
    }

    const posts = await this.prisma.post.findMany({
      skip: isFiltering ? undefined : skip,
      take: isFiltering ? undefined : limit,
      where: {
        NOT: {
          profileId: isFiltering ? '' : profile.id,
        },
        profile: {
          name: isFiltering
            ? { contains: paginatedData.name, mode: 'insensitive' }
            : undefined,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        caption: true,
        description: true,
        postPhoto: {
          select: {
            id: true,
            mediaUrl: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        profile: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        likes: {
          select: {
            profileId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    const totalPages = Math.ceil(totalPosts / limit);
    const result = {
      posts: posts,
      meta: {
        currentPage: page,
        currentPost: limit,
        totalPages,
        totalItems: totalPosts ?? posts.length,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
    if (!isFiltering)
      await this.cacheService.set<typeof result>(key, result, 1000 * 60 * 10);
    return result;
  }

  async toggleSavedPost(postMedia: SavePostDto, profile: profileDto) {
    const saved = postMedia.savedPosts.find((s) => s.profileId === profile.id);

    if (!saved)
      await this.createSavePost(profile.id, {
        postMediaId: postMedia.id,
        profileId: postMedia.post.profileId,
      });

    if (saved)
      await this.deleteSavedPost({
        profileId: profile.id,
        id: saved.id,
      });

    const profileKey = `profile:${profile.id}`;
    await this.cacheService.delete(profileKey);

    const savedPostKey = `profile:${profile.id}:saved-posts`;
    await this.cacheService.delete(savedPostKey);
  }

  private async createSavePost(
    profileId: string,
    postMedia: { postMediaId: string; profileId: string },
  ) {
    const isFollowing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: profileId,
          followingId: postMedia.profileId,
        },
      },
    });
    if (!isFollowing) throw new BadRequestException('Follow to save the post');

    await this.prisma.savePost.create({
      data: {
        postMediaId: postMedia.postMediaId,
        profileId: profileId,
      },
    });
  }

  async getSavedPost(profile: profileDto) {
    const key = `profile:${profile.id}:saved-posts`;
    const cacheSavedPost = await this.cacheService.get(key);
    if (cacheSavedPost) return cacheSavedPost;

    const savedPosts = await this.prisma.savePost.findMany({
      where: { profileId: profile.id },
      select: {
        post: {
          select: {
            id: true,
            mediaUrl: true,
            post: {
              select: {
                profile: {
                  select: {
                    avatarUrl: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    await this.cacheService.set<typeof savedPosts>(key, savedPosts);
    return savedPosts;
  }

  private async deleteSavedPost(savedPost: { profileId: string; id: string }) {
    await this.prisma.savePost.delete({
      where: { id: savedPost.id },
      select: { id: true },
    });
  }
}
