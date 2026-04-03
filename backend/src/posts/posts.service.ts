import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { profileDto } from 'src/profile/dto/profile.dto';
import { CreatePostDto } from './dto/create.post';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { PostDto, SavedPostDto } from './dto/posts.dto';
import { FindPostQueryDto } from './dto/pagination-filtering.dto';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryService,
    private cacheService: AppCacheService,
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
      throw new BadRequestException('Delete some posts to add a new');

    const post = await this.prisma.post.create({
      data: {
        profileId: profile.id,
        caption: data.caption,
      },
      select: {
        id: true,
        caption: true,
        profile: {
          select: {
            name: true,
          },
        },
      },
    });

    const result = {
      id: post.id,
      caption: post.caption,
      photos: [] as { imageUrl: string; id: string; order: number }[],
    };

    const profileName = post.profile.name;
    let filename = '';
    for (let i = 0; i < postMedia.length; i++) {
      filename = `${crypto.randomUUID()}-${i + 1}`;
      const upload = await this.cloudService.uploadPost(
        postMedia[i],
        filename,
        profileName,
      );

      const postPhoto = await this.prisma.postPhoto.create({
        data: {
          imageUrl: upload.secure_url,
          cloudId: upload.public_id,
          order: i + 1,
          postId: post.id,
        },
        select: {
          imageUrl: true,
          id: true,
          order: true,
        },
      });

      result.photos.push(postPhoto);
    }

    const key = `post`;
    await this.cacheService.delByPattern(key);
    return result;
  }

  async savePost(profile: profileDto, postPhotoId: string) {
    const postCreatorId = await this.prisma.postPhoto.findUnique({
      where: { id: postPhotoId },
      select: {
        post: {
          select: {
            profile: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    if (!postCreatorId)
      throw new InternalServerErrorException('Could not get Profile Creator');

    const isFollowing = await this.prisma.follow.count({
      where: {
        followerId: profile.id,
        followingId: postCreatorId.post.profile.id,
      },
    });
    if (!isFollowing)
      throw new BadRequestException('You must be following to save the post');

    const key = `saved-posts:${profile.id}`;
    await this.cacheService.delete(key);

    return await this.prisma.postPhoto.findFirst({
      where: { id: postPhotoId },
      select: {
        imageUrl: true,
        id: true,
      },
    });
  }

  async deletePost(post: PostDto, profile: profileDto) {
    if (post.profileId !== profile.id)
      throw new BadRequestException(
        'You are not allowed to delete others profile post',
      );

    const postMedias = await this.prisma.postPhoto.findMany({
      where: { postId: post.id },
      select: { id: true, cloudId: true },
    });

    const cloudDel = postMedias.map(async (media) => {
      await this.cloudService.delete(media.cloudId);
    });
    await Promise.all(cloudDel);
    const key = `post`;
    await this.cacheService.delByPattern(key);

    return await this.prisma.post.delete({
      where: { id: post.id },
      select: { id: true },
    });
  }

  async deleteSavedPost(savedPost: SavedPostDto, profile: profileDto) {
    if (savedPost.profileId !== profile.id)
      throw new BadRequestException(
        'You are not allowed to delete others profile post',
      );

    const key = `saved-posts:${profile.id}`;
    await this.cacheService.delete(key);
    return await this.prisma.savePost.delete({
      where: { id: savedPost.id },
      select: { id: true },
    });
  }

  async getSavedPosts(profile: profileDto) {
    const key = `saved-posts:${profile.id}`;
    const cachedData = await this.cacheService.get(key);
    if (cachedData) return cachedData;
    const savedPosts = await this.prisma.savePost.findMany({
      where: { profileId: profile.id },
      select: {
        id: true,
        post: {
          select: {
            imageUrl: true,
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
    if (savedPosts)
      await this.cacheService.set<typeof savedPosts>(key, savedPosts);
    return savedPosts;
  }

  async getAllPost(profile: profileDto, paginatedData: FindPostQueryDto) {
    const page = paginatedData.page ?? 1;
    const limit = paginatedData.limit ?? 10;
    const key = `post:profile:${profile.id}:page:${page}:limit:${limit}`;
    const cachedPosts = await this.cacheService.get(key);
    const isFiltering = !!paginatedData.name;
    if (!isFiltering) return cachedPosts;

    const skip = (page - 1) * limit;
    let totalPosts = 0;
    if (isFiltering)
      totalPosts = await this.prisma.post.count({
        where: {
          NOT: {
            profileId: profile.id,
          },
        },
      });

    const posts = await this.prisma.post.findMany({
      skip: isFiltering ? undefined : skip,
      take: isFiltering ? undefined : limit,
      where: {
        NOT: {
          profileId: profile.id,
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
        postPhoto: {
          select: {
            id: true,
            imageUrl: true,
            order: true,
          },
        },
        profile: {
          select: {
            name: true,
            avatarUrl: true,
            followers: {
              select: {
                followerId: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
        },
      },
    });
    const totalPages = Math.ceil(totalPosts / limit);
    const result = {
      posts,
      meta: isFiltering
        ? null
        : {
            currentPage: page,
            currentReels: limit,
            totalPages,
            totalItems: totalPosts,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
          },
    };
    if (!isFiltering) await this.cacheService.set<typeof posts>(key, posts);
    return result;
  }

  async getPost(post: PostDto) {
    const key = `post:${post.id}`;
    const cachedData = await this.cacheService.get(key);
    if (cachedData) return cachedData;
    const postData = await this.prisma.post.findFirst({
      where: { id: post.id },
      select: {
        id: true,
        caption: true,
        postPhoto: {
          select: {
            id: true,
            imageUrl: true,
            order: true,
          },
        },
        profile: {
          select: {
            name: true,
            avatarUrl: true,
            followers: {
              select: {
                followerId: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            parentId: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
        },
      },
    });
    await this.cacheService.set<typeof postData>(key, postData, 600);
    return postData;
  }
}
