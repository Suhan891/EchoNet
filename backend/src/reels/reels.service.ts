import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReelDataDto } from './dto/reel-data';
import { profileDto } from 'src/profile/dto/profile.dto';
import { CloudinaryReelService } from './cloudinary.service';
import { ReelDto } from './pipes/reelId.dto';
import { authUserDto } from 'src/auth/tokens/token.dto';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class ReelsService {
  constructor(
    private prismaService: PrismaService,
    private cloudService: CloudinaryReelService,
  ) {}

  async create(
    reelData: ReelDataDto,
    reelMedia: Express.Multer.File,
    profile: profileDto,
  ) {
    const reel = await this.prismaService.reel.count({
      where: { profileId: profile.id },
    });
    if (reel >= 50)
      throw new BadRequestException(
        'You have exceeded the limit of 50. Delete to continue',
      );

    const filename = crypto.randomUUID();

    const upload = await this.cloudService.uploadVideoReel(reelMedia, filename);

    return await this.prismaService.reel.create({
      data: {
        profileId: profile.id,
        cloudId: upload.public_id,
        videoUrl: upload.secure_url,
        caption: reelData.caption,
      },
      select: {
        id: true,
        videoUrl: true,
        caption: true,
      },
    });
  }

  async remove(reel: ReelDto, profile: profileDto, user: authUserDto) {
    if (user.role !== Role.ADMIN && reel.profileId !== profile.id)
      throw new UnauthorizedException('You are not allowed to delete');

    const publicId = reel.cloudId;
    await this.cloudService.deleteReel(publicId);
    return await this.prismaService.reel.delete({
      where: { id: reel.id },
      select: { id: true },
    });
  }

  async update(
    reelData: ReelDataDto,
    reel: ReelDto,
    profile: profileDto,
    user: authUserDto,
  ) {
    if (user.role !== Role.ADMIN && reel.profileId !== profile.id)
      throw new UnauthorizedException('You are not allowed to update');

    return await this.prismaService.reel.update({
      where: { id: reel.id },
      data: { caption: reelData.caption },
      select: {
        id: true,
        videoUrl: true,
        caption: true,
      },
    });
  }

  async getAllReel(profile: profileDto) {
    return await this.prismaService.reel.findMany({
      where: {
        NOT: {
          profileId: profile.id,
        },
      },
    });
  }
}
