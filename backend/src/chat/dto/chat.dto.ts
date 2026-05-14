import { ChatType } from 'src/generated/prisma/enums';

export interface CreatePersonalDto {
  id: string;
  chat: {
    isGroup: boolean;
    profiles: {
      id: string;
    }[];
  }[];
}
export interface ChatProfileDto {
  id: string;
  isPrivate: boolean;
  chats: {
    chat: {
      type: ChatType;
      members: {
        profileId: string;
      }[];
    };
    chatId: string;
  }[];
}
export interface ChatDto {
  id: string;
  name: string | null;
  creatorId: string;
  type: ChatType;
  members: {
    id: string;
    profileId: string;
    isApproved: boolean;
  }[];
}

export interface ProfGroupDto {
  profileId: string;
  isPrivate: boolean;
}
