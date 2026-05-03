import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { NoProfile } from './decorator/no-profile';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import type { othersProfile, profileDto, toggleProf } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarValidationPipe } from './pipes/files.validate';
import { CurrentUser } from 'src/auth/gaurds/refresh.decorator';
import type { authUserDto } from 'src/auth/tokens/token.dto';
import { currentProfile } from './decorator/get-profile';
//import { NoAccount } from 'src/auth/decorators/no-account';
import { ValidateProfileExists } from './pipes/existing.profile';
import { Throttle } from '@nestjs/throttler';
import { ProfileGaurd } from './gaurds/profile.gaurd';
import { AvatarProps } from './dto/avatar';
import { ValidateOthersProfile } from './pipes/validate.profile';
import { ValidateToggleProfile } from './pipes/validate.toggle.profile';

@Controller('profile')
@UseGuards(ProfileGaurd)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Throttle({ default: { ttl: 60 * 60 * 1000, limit: 3 } })
  @Post('create')
  @NoProfile()
  @ResponseMessage('Profile created')
  @UseInterceptors(FileInterceptor('avatar'))
  async createProfile(
    @Body() profilData: CreateProfileDto,
    @UploadedFile(new AvatarValidationPipe())
    avatar: Express.Multer.File | null,
    @CurrentUser() user: authUserDto,
  ) {
    return await this.profileService.createProfile(user, profilData, avatar);
  }

  @Put('upavatar')
  @ResponseMessage('Profile Avatar updated')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @UploadedFile(new AvatarValidationPipe())
    avatar: Express.Multer.File | null,
    @Body() body: { avatarUrl: string },
    @currentProfile() profile: profileDto,
    @CurrentUser() user: authUserDto,
  ) {
    const data = {
      avatar,
      avatarUrl: body.avatarUrl,
    } as AvatarProps;
    return await this.profileService.updateAvatar(profile, data, user);
  }

  @Put('update')
  @ResponseMessage('Profile updated')
  async update(
    @Body() data: UpdateProfileDto,
    @currentProfile() profile: profileDto,
    @CurrentUser() user: authUserDto,
  ) {
    return await this.profileService.updateProfile(data, profile, user);
  }

  @Get('own-details')
  @ResponseMessage('Own Profile Details Received Successfull')
  async getOwnProfile(@currentProfile() profile: profileDto) {
    return await this.profileService.getOwnProfile(profile);
  }

  @Put('privacy')
  @ResponseMessage('Privacy updated')
  async updatePrivacy(@currentProfile() profile: profileDto) {
    return await this.profileService.privacyUpdate(profile);
  }

  @Post('activate/:profileId')
  @ResponseMessage('Profile Activation Successfull')
  async activateProfile(
    @CurrentUser() user: authUserDto,
    @Param('profileId', ParseUUIDPipe, ValidateToggleProfile)
    newProf: toggleProf,
    @currentProfile() profile: profileDto,
  ) {
    return await this.profileService.activateProfile(user, profile, newProf);
  }

  @Post('remove-profile') // Several changes has to be done
  @ResponseMessage('Profile Deleted Successfully')
  async deleteProfile(
    @currentProfile() profile: profileDto,
    @Query('profileId', ParseUUIDPipe, ValidateProfileExists) profileId: string,
    @CurrentUser() user: authUserDto,
  ) {
    return await this.profileService.removeProfile(profile, profileId, user);
  }

  @Get('other/:profileId')
  @ResponseMessage('Profile Fetching details Successfull')
  async getProfile(
    @Param('profileId', ParseUUIDPipe, ValidateOthersProfile)
    data: othersProfile,
    @currentProfile() profile: profileDto,
  ) {
    return await this.profileService.getProfile(data, profile);
  }

  @Get('all')
  @ResponseMessage('All Profiles received')
  async allProfiles(@currentProfile() profile: profileDto) {
    return await this.profileService.getAllProfile(profile);
  }
}
