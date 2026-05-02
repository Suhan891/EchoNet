import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { ValidateProfileExists } from 'src/profile/pipes/existing.profile';
import { FollowService } from './follow.service';
import { ValidateFollowPipe } from './pipes/follow.exists';
import type { followDto } from './dto/validate-follow.dto';
import { ProfileHasFollowPipe } from './pipes/profile.has.follow';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post('create/:id')
  @ResponseMessage('Follow request successfull')
  async create(
    @Param('id', ParseUUIDPipe, ValidateProfileExists) profileId: string,
    @currentProfile() profile: profileDto,
  ) {
    return await this.followService.create(profile, profileId);
  }

  @Put('remove/:id')
  @ResponseMessage('Follow deleted  successfull')
  async remove(
    @Param('id', ParseUUIDPipe, ValidateFollowPipe) follow: followDto,
    //@currentProfile()profile: profileDto,
  ) {
    return await this.followService.remove(follow);
  }

  @Get(':id')
  @ResponseMessage('Own details received')
  async getFollow(
    @Query('type') follow: 'FOLLOWERS' | 'FOLLOWING',
    @currentProfile() profile: profileDto,
    @Param('id', ParseUUIDPipe, ProfileHasFollowPipe) profileId: string,
  ) {
    if (!['FOLLOWERS', 'FOLLOWING'].includes(follow)) {
      throw new BadRequestException('Follow type mismatch');
    }
    return await this.followService.getFollow(profileId, follow, profile);
  }

  @Get('followers')
  @ResponseMessage('Followers data received')
  async getFollowers(
    @Param('id', ParseUUIDPipe, ValidateProfileExists) profileId: string,
  ) {
    return await this.followService.getFollowers(profileId);
  }

  @Get('followings')
  @ResponseMessage('Followings data received')
  async getFollowings(
    @Param('id', ParseUUIDPipe, ValidateProfileExists) profileId: string,
  ) {
    return await this.followService.getFollowings(profileId);
  }
}
