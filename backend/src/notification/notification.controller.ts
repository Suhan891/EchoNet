import { Controller, Get, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { currentProfile } from 'src/profile/decorator/get-profile';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { NotificationPipe } from './pipe/validate.notification';
import type { NotifyType } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notifyService: NotificationService) {}

  @Get()
  @ResponseMessage('All notifications retrived')
  async getNotifications(@currentProfile() profile: profileDto) {
    return await this.notifyService.getNotifications(profile);
  }

  @Put('/:id')
  @ResponseMessage('Notify view updated')
  async getNotifyData(
    @currentProfile() profile: profileDto,
    @Param('id', ParseUUIDPipe, NotificationPipe) data: NotifyType,
  ) {
    return await this.notifyService.getNoificationData(profile, data);
  }
}
