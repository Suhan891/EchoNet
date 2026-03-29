import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { profileDto } from 'src/profile/dto/profile.dto';
import { CreatePostDto } from './dto/create.post';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryPostService } from './cloudinary.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private cloudService: CloudinaryPostService,
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
    const isFollower = await this.prisma.follow.count({
      where: {
        followerId: postCreatorId.post.profile.id,
        followingId: profile.id,
      },
    });

    if (!isFollower && !isFollowing)
      throw new BadRequestException(
        'Be a follower or following profile to save it',
      );

    return await this.prisma.postPhoto.findFirst({
      where: { id: postPhotoId },
      select: {
        imageUrl: true,
        id: true,
      },
    });
  }

  async getAllPost(profile: profileDto) {
    return await this.prisma.post.findMany({
      where: {
        NOT: {
          profileId: profile.id,
        },
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
  }

  async getPost(postId: string) {
    return await this.prisma.post.findFirst({
      where: { id: postId },
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
    })
  }
}
