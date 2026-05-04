import {
  BadGatewayException,
  BadRequestException,
  Controller,
  Get,
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
import type { RequestType, ResLikeDto } from './dto/request.dto';
import { ResponseMessage } from 'src/common/decorators/response-message';

@Controller('like')
export class LikeController {
  constructor(
    private likeService: LikeService,
    private prisma: PrismaService,
  ) {}

  @Post('toggle/:id')
  @ResponseMessage('Like Updated successfully')
  async toggle(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('name') name: RequestType,
    @currentProfile() profile: profileDto,
  ) {
    if (!name || !id)
      throw new BadGatewayException('Both id and type is required');
    const request = { id, name, profileId: profile.id };
    const data: ResLikeDto = await new ValidateRequestPipe(
      this.prisma,
    ).transform(request);
    return await this.likeService.toggleLike(data, profile);
  }

  @Get('view/:id')
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
