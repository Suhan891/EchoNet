import {
  BadGatewayException,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { ValidateRequestPipe } from './pipes/validate.request';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('like')
export class LikeController {
  constructor(
    private likeService: LikeService,
    private prisma: PrismaService,
  ) {}

  @Post('add')
  async create(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('name') name: string,
    @currentProfile() profile: profileDto,
  ) {
    if (!name || !id)
      throw new BadGatewayException('Both id and name is required');
    const response = { id, name, profileId: profile.id };
    const data = await new ValidateRequestPipe(this.prisma).transform(response);
    return await this.likeService.create(data);
  }
}
