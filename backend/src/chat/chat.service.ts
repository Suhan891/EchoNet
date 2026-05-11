import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';
import { AddChatDto, ChatDto, ChatProfileDto } from './dto/chat';
import { NotificationService } from 'src/notification/notification.service';
import { NotifyDto } from 'src/notification/dto/notification.dto';
import { GroupChatDto } from './dto/group-chat';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
    private notifyService: NotificationService,
  ) {}

  async getProfileForPersonal(profile: profileDto) {
    const key = `profile:${profile.id}:chat:personal`;
    const cachedPersonal = await this.cacheService.get(key);
    if (cachedPersonal) return cachedPersonal;
    const profiles = await this.prisma.chat.findMany({
      // needds more examination
      where: {
        NOT: {
          type: 'PRIVATE',
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
      },
      select: {
        members: {
          where: {
            NOT: {
              profileId: profile.id,
            },
          },
          select: {
            name: true,
            id: true,
            avatarUrl: true,
          },
        },
      },
    });
    await this.cacheService.set<typeof profiles>(key, profiles);
    return profiles;
  }

  async getProfileForGroup(profile: profileDto) {
    const key = `chat:group:profile:${profile.id}`;
    const cachedGroup = await this.cacheService.get(key);
    if (cachedGroup) return cachedGroup;
    const chats = await this.prisma.profile.findMany({
      where: {
        NOT: [
          { id: profile.id },
          { avatarUrl: null }, // Later be removed => Kept because of some mismatch firstly
        ],
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });
    await this.cacheService.set<typeof chats>(key, chats);
    return chats;
  }

  async createPrivatechat(profile: profileDto, otherProfile: ChatDto) {
    if (profile.id === otherProfile.id)
      throw new ForbiddenException(
        'You cannot create with yourself personal chat',
      );

    const privateChats = otherProfile.chats.filter(
      (chat) => chat.chat.type === 'PRIVATE',
    );

    privateChats.forEach((chat) => {
      const existing = chat.chat.members.some(
        (prof) => prof.profileId === profile.id,
      );
      if (existing)
        throw new BadRequestException('Already a existing personal chat');
    });

    const chat = await this.prisma.chat.create({
      data: {
        creatorId: profile.id,
        type: 'PRIVATE',
        isApproved: false,
        members: {
          createMany: {
            data: [
              { profileId: profile.id, isApproved: true },
              { profileId: otherProfile.id, isApproved: false },
            ],
          },
        },
      },
      select: {
        id: true,
      },
    });

    const notify = {
      format: {
        type: 'CHAT',
        chatId: chat.id,
      },
      content: `${profile.name} wants to chat with you. Approve to proceed chatting`,
      receiverId: otherProfile.id,
    } as NotifyDto;

    await this.notifyService.createNotification(notify);

    await this.cacheService.delete(`profile:${profile.id}:chat:personal`);
  }

  async crateGroupChat(profile: profileDto, data: GroupChatDto) {
    const ValidatedProfile = data.profiles.map(async (prof) => {
      return await this.prisma.profile.findUniqueOrThrow({
        where: { id: prof },
        select: { isPrivate: true, id: true },
      });
    });
    const profiles = await Promise.all(ValidatedProfile);
    const chat = await this.prisma.chat.create({
      data: {
        name: data.name,
        mediaUrl: data.mediaUrl,
        creatorId: profile.id,
        type: 'GROUP',
        members: {
          create: {
            profileId: profile.id,
            isApproved: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const addMembers = profiles.map(async (prof) => {
      await this.prisma.chatMember.create({
        data: {
          chatId: chat.id,
          profileId: prof.id,
          isApproved: !prof.isPrivate,
        },
      });
      const notify = {
        format: {
          type: 'CHAT',
          chatId: chat.id,
        },
        content: `${profile.name} has added you in chat ${chat.name}`,
        receiverId: prof.id,
      } as NotifyDto;

      await this.notifyService.createNotification(notify);
    });

    await Promise.all(addMembers);
  }

}
