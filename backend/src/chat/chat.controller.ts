import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { currentProfile } from 'src/profile/decorator/get-profile';
import { ValidatePersonalPipe } from './pipe/validate.profile.chat';
import type { ChatProfileDto } from './dto/chat.dto';
import { GroupChatDto } from './dto/group-chat';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('private')
  @ResponseMessage('Profiles received for personal chat')
  async getProfilesForPrivateChat(@currentProfile() profile: profileDto) {
    console.log('Profile', profile);
    return await this.chatService.getProfileForPersonal(profile);
  }

  @Get('group')
  @ResponseMessage('Profiles received for group')
  async getProfForGroupChat(@currentProfile() profile: profileDto) {
    return await this.chatService.getProfileForGroup(profile);
  }

  @Post('private/:profileId')
  @ResponseMessage('Private chat created, waiting for receiver approval')
  async createPrivate(
    @currentProfile() profile: profileDto,
    @Param('profileId', ParseUUIDPipe, ValidatePersonalPipe)
    otherProf: ChatProfileDto,
  ) {
    return await this.chatService.createPrivatechat(profile, otherProf);
  }

  @Post('group/create')
  @ResponseMessage('Group chat created')
  async createGroup(
    @currentProfile() profile: profileDto,
    @Body() data: GroupChatDto,
  ) {
    return await this.chatService.crateGroupChat(profile, data);
  }
}
