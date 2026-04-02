import {
  BadGatewayException,
  Controller,
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
import type { LikeDTo } from './dto/request.dto';
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
    @Query('name') name: string,
    @currentProfile() profile: profileDto,
  ) {
    if (!name || !id)
      throw new BadGatewayException('Both id and name is required');
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
}
