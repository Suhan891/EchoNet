import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { FollowService } from './follow.service';
import type { FollowFromProfileDto } from './dto/validate-follow.dto';
import { ProfileHasFollowPipe } from './pipes/profile.has.follow';
import { ValidateFollowProfilePipe } from './pipes/follow.from.profile';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post('toggle/:profileId')
  @ResponseMessage('Follow updated')
  async toggle(
    @Param('profileId', ParseUUIDPipe, ValidateFollowProfilePipe)
    othersProf: FollowFromProfileDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.followService.toggleFollow(othersProf, profile);
  }

  @Get(':id')
  @ResponseMessage('Own details received')
  async getFollow(
    @Query('type') follow: 'FOLLOWERS' | 'FOLLOWING',
    @Param('id', ParseUUIDPipe, ProfileHasFollowPipe) profileId: string,
  ) {
    if (!['FOLLOWERS', 'FOLLOWING'].includes(follow)) {
      throw new BadRequestException('Follow type mismatch');
    }
    return await this.followService.getFollow(profileId, follow);
  }
}
