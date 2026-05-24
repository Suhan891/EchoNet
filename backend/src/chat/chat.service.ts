import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AppCacheService } from 'src/common/caching/redis.cache';
import { PrismaService } from 'src/prisma/prisma.service';
import { profileDto } from 'src/profile/dto/profile.dto';
import { ChatDto, ChatProfileDto } from './dto/chat.dto';
import { NotificationService } from 'src/notification/notification.service';
import { NotifyDto } from 'src/notification/dto/notification.dto';
import { GroupChatDto } from './dto/group-chat';
import { MessageDto, MsgViewDto } from './dto/message.dto';
import { CloudinaryService } from 'src/common/file-upload/cloudinary.service';
import { EventService } from 'src/event/event.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private cacheService: AppCacheService,
    private eventService: EventService,
    private notifyService: NotificationService,
    private cloudService: CloudinaryService,
  ) {}

  async getProfileForPersonal(profile: profileDto) {
    const key = `profile:${profile.id}:chat:personal`;
    const cachedPersonal = await this.cacheService.get(key);
    if (cachedPersonal) return cachedPersonal;
    const profiles = await this.prisma.profile.findMany({
      where: {
        NOT: [
          { id: profile.id },
          { avatarUrl: null },
          {
            chats: {
              some: {
                chat: {
                  type: 'PRIVATE',
                  members: {
                    some: {
                      profileId: profile.id,
                    },
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        isPrivate: true,
      },
    });
    await this.cacheService.set<typeof profiles>(key, profiles);
    return profiles;
  }

  async getProfileForGroup(profile: profileDto) {
    const key = `chat:group:profile:${profile.id}`;
    const cachedGroup = await this.cacheService.get(key);
    if (cachedGroup) return cachedGroup;
    const profiles = await this.prisma.profile.findMany({
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
        isPrivate: true,
      },
    });
    await this.cacheService.set<typeof profiles>(key, profiles);
    return profiles;
  }

  async createPrivatechat(profile: profileDto, otherProfile: ChatProfileDto) {
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

    await this.cacheService.delete(
      `profile:${profile.id}:${otherProfile.id}:details`,
    );

    await this.cacheService.delete(`profile:${profile.id}:chat:personal`);

    await this.cacheService.delete(`profile:${otherProfile.id}:chats`);
    await this.cacheService.delete(`profile:${profile.id}:chats`);
  }

  async crateGroupChat(
    profile: profileDto,
    avatar: Express.Multer.File,
    data: GroupChatDto,
  ) {
    const ValidatedProfile = data.profiles.map(async (prof) => {
      if (profile.id === prof)
        throw new ForbiddenException('You cannot add yourself again');
      return await this.prisma.profile.findUniqueOrThrow({
        where: { id: prof },
        select: { isPrivate: true, id: true },
      });
    });
    const profiles = await Promise.all(ValidatedProfile);
    const fileName = `${crypto.randomUUID()}`;
    const upload = await this.cloudService.uploadedAvatar(avatar, fileName);
    const chat = await this.prisma.chat.create({
      data: {
        name: data.name,
        mediaUrl: upload.secure_url,
        cloudId: upload.public_id,
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
      await this.cacheService.delete(`profile:${prof.id}:chats`);
    });

    await Promise.all(addMembers);
    await this.cacheService.delete(`profile:${profile.id}:chats`);
  }

  async getProfToAdd(profile: profileDto, chat: ChatDto) {
    if (profile.id !== chat.creatorId)
      throw new ForbiddenException('Be the admin to add members');
    const key = `profile:${profile.id}:new:members`;
    const cachedOtherProf = await this.cacheService.get(key);
    if (cachedOtherProf) return cachedOtherProf;
    const profiles = await this.prisma.profile.findMany({
      where: {
        NOT: {
          OR: [
            { avatarUrl: null }, // As some wrong data present
            {
              chats: {
                some: {
                  chat: {
                    id: chat.id,
                  },
                },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        isPrivate: true,
      },
    });
    await this.cacheService.set<typeof profiles>(key, profiles, 60 * 30);
    return profiles;
  }

  async addMembers(
    profile: profileDto,
    chat: ChatDto,
    otherProf: ChatProfileDto,
  ) {
    if (profile.id === otherProf.id)
      throw new ForbiddenException('You cannot add yourself again in the chat');

    if (chat.creatorId !== profile.id)
      throw new ForbiddenException('Be the admin to add members');

    const existingChat = otherProf.chats.find((c) => c.chatId === chat.id);

    if (chat.type !== 'GROUP')
      throw new BadRequestException('Members can only be added in the group');

    if (existingChat)
      throw new BadRequestException('Chat already has this member');

    await this.prisma.chatMember.create({
      data: {
        chatId: chat.id,
        profileId: otherProf.id,
        isApproved: !otherProf.isPrivate,
      },
    });

    const notify = {
      format: {
        type: 'CHAT',
        chatId: chat.id,
      },
      content: `${profile.name} has added you in chat ${chat.name}`,
      receiverId: otherProf.id,
    } as NotifyDto;

    await this.notifyService.createNotification(notify);

    await this.cacheService.delete(`profile:${profile.id}:chats`);
    await this.cacheService.delete(`profile:${otherProf.id}:chats`);

    await this.cacheService.delete(`chat:${chat.id}:members`);
    await this.cacheService.delete(`profile:${profile.id}:new:members`);
  }

  async toggleChatApproval(profile: profileDto, chat: ChatDto) {
    if (chat.type === 'GROUP' && profile.id === chat.creatorId)
      throw new BadRequestException(
        'Creator cannot update approval of himself',
      );
    const existProf = chat.members.find(
      (prof) => prof.profileId === profile.id,
    );
    if (!existProf)
      throw new BadRequestException(
        'You are not a existing member of the chat',
      );
    await this.prisma.chatMember.update({
      where: { id: existProf.id },
      data: { isApproved: !existProf.isApproved },
    });
    await this.cacheService.delete(`chat:${chat.id}`);
  }

  async getChatFromProfile(profile: profileDto) {
    const key = `profile:${profile.id}:chats`;
    const cachedChat = await this.cacheService.get(key);
    if (cachedChat) return cachedChat;
    const chats = await this.prisma.chatMember.findMany({
      where: { profileId: profile.id },
      select: {
        chat: {
          select: {
            id: true,
            mediaUrl: true,
            name: true,
            type: true,
            members: {
              where: {
                NOT: {
                  chat: {
                    type: 'GROUP',
                  },
                },
              },
              select: {
                profile: {
                  select: {
                    id: true,
                    avatarUrl: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        isApproved: true,
      },
    });
    await this.cacheService.set<typeof chats>(key, chats);
    return chats;
  }

  async getMembersOfGroup(profile: profileDto, chat: ChatDto) {
    const existProf = chat.members.find((c) => c.profileId === profile.id);
    if (!existProf)
      throw new ForbiddenException('Be the member of the chat to members');

    if (chat.type !== 'GROUP')
      throw new BadRequestException('Only a group chat can see members');

    const key = `chat:${chat.id}:members`;
    const cachedMembers = await this.cacheService.get(key);
    if (cachedMembers) return cachedMembers;
    const chatMembers = await this.prisma.chat.findUniqueOrThrow({
      where: { id: chat.id },
      select: {
        id: true,
        creatorId: true,
        members: {
          select: {
            isApproved: true,
            id: true,
            profile: {
              select: {
                id: true,
                avatarUrl: true,
                name: true,
              },
            },
          },
        },
      },
    });

    await this.cacheService.set<typeof chatMembers>(key, chatMembers);
    return chatMembers;
  }

  async getMsgsOnChat(profile: profileDto, chat: ChatDto) {
    const existProf = chat.members.find((c) => c.profileId === profile.id);
    if (!existProf)
      throw new ForbiddenException(
        'Be the member of the chat to view messages',
      );
    const key = `chat:${chat.id}`;
    const cachedMesgs = await this.cacheService.get(key);
    if (cachedMesgs) return cachedMesgs;

    const msgs = await this.prisma.chat.findUnique({
      where: { id: chat.id },
      select: {
        id: true,
        name: true,
        type: true,
        creatorId: true,
        mediaUrl: true,
        members: {
          select: {
            id: true,
            isApproved: true,
            createdAt: true,
            profile: {
              select: {
                name: true,
                avatarUrl: true,
                id: true,
              },
            },
          },
        },
        message: {
          orderBy: {
            createdAt: 'asc',
          },
          where: {
            NOT: {
              chat: {
                members: {
                  some: {
                    profileId: profile.id,
                    isApproved: false,
                  },
                },
              },
            },
          },
          select: {
            id: true,
            content: true,
            mediaUrl: true,
            format: true,
            senderId: true,
            createdAt: true,
            _count: {
              select: {
                msgView: true,
              },
            },
            msgView: {
              select: {
                member: {
                  select: {
                    id: true,
                    profileId: true,
                  },
                },
              },
            },
            sender: {
              select: {
                profile: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const ownProf = msgs?.members.find((p) => p.profile.id === profile.id);
    if (msgs && ownProf && ownProf.isApproved) {
      const awaitMsgs = msgs.message.map(async (m) => {
        const isExisting = m.msgView.some(
          (v) => v.member.profileId === profile.id,
        );

        if (!isExisting) {
          await this.prisma.messageView.create({
            data: {
              memberId: ownProf.id,
              msgId: m.id,
            },
          });
          await this.cacheService.delete(`message:${m.id}`);
        }
      });
      await Promise.all(awaitMsgs);
    }
    await this.cacheService.set<typeof msgs>(key, msgs);
    return msgs;
  }

  async msgView(profile: profileDto, data: MsgViewDto) {
    if (data.sender.profileId !== profile.id)
      throw new ForbiddenException('Be the sender to view the message');
    const key = `message:${data.id}`;
    const cachedViews = await this.cacheService.get(key);
    if (cachedViews) return cachedViews;
    await this.cacheService.set<typeof data>(key, data);
    return data;
  }

  async createMsg(
    message: MessageDto,
    profile: profileDto,
    chat: ChatDto,
    //file: Express.Multer.File | null, => Later
  ) {
    const existProf = chat.members.find(
      (prof) => prof.profileId === profile.id,
    );
    if (!existProf) throw new BadRequestException('Not a member of the chat');
    if (!existProf.isApproved)
      throw new BadRequestException('Approve yourself before messaging');

    await this.prisma.message.create({
      data: {
        chatId: chat.id,
        content: message.content,
        mediaUrl: null,
        format: message.format,
        senderId: existProf.id,
      },
    });
    await this.cacheService.delete(`chat:${chat.id}`);

    const allOtherProf = chat.members.map(async (memb) => {
      if (memb.profileId !== profile.id && memb.isApproved) {
        const isOnline = await this.eventService.isOnline(memb.profileId);
        const content = `${profile.name} has texted you  ${chat.type === 'GROUP' ? chat.name : 'personally'}`;
        if (isOnline)
          this.eventService.sendMsg(memb.profileId, chat.id, content);
        if (!isOnline)
          await this.notifyService.createNotification({
            format: {
              type: 'MESSAGE',
              chatId: chat.id,
            },
            content: `${profile.name} has texted you ${chat.type === 'GROUP' ? chat.name : 'personally'}`,
            receiverId: memb.profileId,
          });
      }
    });
    await Promise.all(allOtherProf);
    await this.cacheService.delete(`chat:${chat.id}`);
    // if (message.format !== 'TEXT' && message.format !== 'GIF') {
    //   // Will be done later
    //   // if(message.format === 'IMAGE')
    //   //   const upload = await this.cloudService.
    // }

    // if (message.format === 'TEXT' || message.format === 'GIF')
    //   await this.createMessage({
    //     chatId: chat.id,
    //     content: message.content,
    //     mediaUrl: message.mediaUrl,
    //     format: message.format,
    //     senderId: profile.id,
    //   });
  }
}
