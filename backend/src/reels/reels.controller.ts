import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ReelsService } from './reels.service';
import { ReelDataDto } from './dto/reel-data';
import { ReelMediaValidatorPipe } from './dto/file.validate';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { Throttle } from '@nestjs/throttler';
import { ReelExistsPipe } from './pipes/reel.exists';
import type { ReelDto } from './pipes/reelId.dto';
import { CurrentUser } from 'src/auth/gaurds/refresh.decorator';
import type { authUserDto } from 'src/auth/tokens/token.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FindReelQueryDto } from './dto/pagination-filter.dto';

@Controller('reels')
export class ReelsController {
  constructor(private reelService: ReelsService) {}

  @Post('create')
  @ResponseMessage('Reeel created')
  @Throttle({ default: { ttl: 24 * 60 * 60 * 1000, limit: 3 } })
  @UseInterceptors(FilesInterceptor('reelMedia', 1))
  async createReel(
    @Body() reelData: ReelDataDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ReelMediaValidatorPipe({})],
      }),
    )
    reelMedia: Express.Multer.File,
    @currentProfile() profile: profileDto,
  ) {
    return await this.reelService.create(reelData, reelMedia, profile);
  }

  @Get('all')
  @ResponseMessage('All reel data fetched')
  async getReels(
    @Query() reelQuery: FindReelQueryDto,
    @currentProfile() profile: profileDto,
  ) {
    return await this.reelService.getAllReel(profile, reelQuery);
  }

  @Put('remove')
  @ResponseMessage('Reel removed')
  async remove(
    @Query('reelId', ParseUUIDPipe, ReelExistsPipe) reel: ReelDto,
    @currentProfile() profile: profileDto,
    @CurrentUser() user: authUserDto,
  ) {
    return await this.reelService.remove(reel, profile, user);
  }
}
