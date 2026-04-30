import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { ValidateRequestPipe } from './pipes/validate.request';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidateLikePipe } from './pipes/validate.like_id';
import type { LikeDTo, RequestType } from './dto/request.dto';
import { ResponseMessage } from 'src/common/decorators/response-message';

@Controller('like')
export class LikeController {
  constructor(
    private likeService: LikeService,
    private prisma: PrismaService,
  ) {}

  @Post('add')
  @ResponseMessage('Like created successfully')
  async create(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('name') name: RequestType,
    @currentProfile() profile: profileDto,
  ) {
    if (!name || !id)
      throw new BadGatewayException('Both id and name is required');
    if (name !== 'POST' && name !== 'REEL' && name !== 'STORY')
      throw new BadRequestException('Type does not exists');
    const response = { id, name, profileId: profile.id };
    const data = await new ValidateRequestPipe(this.prisma).transform(response);
    return await this.likeService.create(data);
  }

  @Put('remove')
  @ResponseMessage('Like removed successfully')
  async remove(
    @Param('likeId', ParseUUIDPipe, ValidateLikePipe) like: LikeDTo,
    @currentProfile() profile: profileDto,
  ) {
    return await this.likeService.remove(profile, like);
  }

  @Get(':id')
  @ResponseMessage('Likes data received')
  async getProfiles(
    @currentProfile() profile: profileDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('type') type: RequestType,
  ) {
    if (!type || !id)
      throw new BadGatewayException('Both id and type is required');
    if (type !== 'POST' && type !== 'REEL' && type !== 'STORY')
      throw new BadRequestException('Type does not exists');
    return await this.likeService.viewProfiles(profile, id, type);
  }
}
