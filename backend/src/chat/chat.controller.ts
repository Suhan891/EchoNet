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
import { ChatService } from './chat.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { currentProfile } from 'src/profile/decorator/get-profile';
import { ValidatePersonalPipe } from './pipe/validate.profile.chat';
import type { ChatDto, ChatProfileDto } from './dto/chat.dto';
import { GroupChatDto } from './dto/group-chat';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaValidationPipe } from './pipe/group.media.pipe';
import { ValidateChatPipe } from './pipe/add-profile.group';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('private')
  @ResponseMessage('Profiles received for personal chat')
  async getProfilesForPrivateChat(@currentProfile() profile: profileDto) {
    return await this.chatService.getProfileForPersonal(profile);
  }

  @Get('group')
  @ResponseMessage('Profiles received for group')
  async getProfForGroupChat(@currentProfile() profile: profileDto) {
    return await this.chatService.getProfileForGroup(profile);
  }

  @Post('private')
  @ResponseMessage('Private chat created, waiting for receiver approval')
  async createPrivate(
    @currentProfile() profile: profileDto,
    @Query('profile', ValidatePersonalPipe)
    otherProf: ChatProfileDto,
  ) {
    return await this.chatService.createPrivatechat(profile, otherProf);
  }

  @Post('group/create')
  @ResponseMessage('Group chat created')
  @UseInterceptors(FileInterceptor('avatar'))
  async createGroup(
    @currentProfile() profile: profileDto,
    @Body() data: GroupChatDto,
    @UploadedFile(new MediaValidationPipe())
    avatar: Express.Multer.File,
  ) {
    return await this.chatService.crateGroupChat(profile, avatar, data);
  }

  @Get()
  @ResponseMessage('Received All Chats')
  async getChats(@currentProfile() profile: profileDto) {
    return await this.chatService.getChatFromProfile(profile);
  }

  @Put('approve/:chatId')
  @ResponseMessage('Approval Updated')
  async approveChat(
    @currentProfile() profile: profileDto,
    @Param('chatId', ParseUUIDPipe, ValidateChatPipe) chat: ChatDto,
  ) {
    return await this.chatService.toggleChatApproval(profile, chat);
  }

  @Get('messages/:chatId')
  @ResponseMessage('Received all Chat data')
  async getMessages(
    @currentProfile() profile: profileDto,
    @Param('chatId', ParseUUIDPipe, ValidateChatPipe) chat: ChatDto,
  ) {
    return await this.chatService.getMsgsOnChat(profile, chat);
  }
}
