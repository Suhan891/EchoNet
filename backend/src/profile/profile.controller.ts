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
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { NoProfile } from './decorator/no-profile';
import type {
  CreateProfileDto,
  profileDto,
  UpdateProfileDto,
} from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarValidationPipe } from './pipes/files.validate';
import { CurrentUser } from 'src/auth/gaurds/refresh.decorator';
import type { authUserDto } from 'src/auth/tokens/token.dto';
import { currentProfile } from './decorator/get-profile';
import { NoAccount } from 'src/auth/decorators/no-account';
import { ValidateProfileExists } from './pipes/existing.profile';
import { Throttle } from '@nestjs/throttler';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Throttle({ default: { ttl: 60 * 60 * 1000, limit: 3 } })
  @Post('create')
  @NoProfile()
  @ResponseMessage('Profile created')
  @UseInterceptors(FileInterceptor('avatar'))
  async createProfile(
    @Body() profilData: CreateProfileDto,
    @UploadedFile(new AvatarValidationPipe()) avatar: Express.Multer.File,
    @CurrentUser() user: authUserDto,
  ) {
    return await this.profileService.createProfile(user, profilData, avatar);
  }

  @Post('update-avatar')
  @ResponseMessage('Profile created')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @UploadedFile(new AvatarValidationPipe()) avatar: Express.Multer.File,
    @currentProfile() profile: profileDto,
    @CurrentUser() user: authUserDto,
  ) {
    return await this.profileService.updateAvatar(profile, avatar, user);
  }

  @Post('update')
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
  async getOwnProfile(
    @CurrentUser() user: authUserDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.profileService.getOwnProfile(profile, user);
  }

  // After toggling that new profile => access token refetch => active profile taking from /auth/me => calling with this new profile
  @Post('activate-profile')
  @ResponseMessage('Profile Activation Successfull')
  @NoAccount(true) // Validating the new profile to pass even if it's isActive is false
  async activateProfile(
    @CurrentUser() user: authUserDto,
    @Param('profileId', ParseUUIDPipe, ValidateProfileExists) profileId: string,
    @currentProfile() profile: profileDto,
  ) {
    return await this.profileService.activateProfile(user, profile, profileId);
  }

  @Put('remove-profile')
  @ResponseMessage('Profile Deleted Successfully')
  async deleteProfile(
    @currentProfile() profile: profileDto,
    @Query('profileId', ParseUUIDPipe, ValidateProfileExists) profileId: string,
    @CurrentUser() user: authUserDto,
  ) {
    return await this.profileService.removeProfile(profile, profileId, user);
  }

  @Get('others-profile')
  @ResponseMessage('Profile Fetching details Successfull')
  async getProfile(
    @Param('id', ParseUUIDPipe, ValidateProfileExists) profileId: string,
  ) {
    return await this.profileService.getProfile(profileId);
  }

  @Get('all-profiles')
  @ResponseMessage('All Profiles received')
  async allProfiles(@currentProfile() profile: profileDto) {
    return await this.profileService.getAllProfile(profile);
  }
}
