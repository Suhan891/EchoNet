import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { ValidateProfileExists } from 'src/profile/pipes/existing.profile';
import { FollowService } from './follow.service';
import { ValidateFollowExists } from './follow.pipe';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post('create')
  @ResponseMessage('Follow request successfull')
  async create(
    @Param('id', ParseUUIDPipe, ValidateProfileExists) profileId: string,
    @currentProfile() profile: profileDto,
  ) {
    return await this.followService.create(profile, profileId);
  }

  @Put('remove')
  @ResponseMessage('Follow deleted  successfull')
  async remove(
    @Param('id', ParseUUIDPipe, ValidateFollowExists) followId: string,
    //@currentProfile() profile: profileDto,
  ) {
    return await this.followService.remove(followId);
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
