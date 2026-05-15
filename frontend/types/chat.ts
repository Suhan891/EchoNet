export interface CreateChatDto {
  id: string;
  name: string;
  avatarUrl: string;
  isPrivate: boolean;
}
export interface ChatDto {
  chat: {
    id: string;
    name: string;
    mediaUrl: string;
    type: "PRIVATE" | "GROUP";
    members: {
      profile: {
        id: string;
        name: string;
        avatarUrl: string;
      };
    }[];
  };
  isApproved: boolean;
}

export interface ChatsMsgsDto {
  id: string;
  name: string | null;
  mediaUrl: string;
  creatorId: string;
  type: "PRIVATE" | "GROUP";
  members: {
    createdAt: Date;
    isApproved: boolean;
    profile: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
  message: {
    _count: {
      members: number;
    };
    id: string;
    mediaUrl: string | null;
    format: "TEXT" | "FILE" | "VIDEO" | "GIF" | "IMAGE";
    content: string | null;
    createdAt: Date;
    senderId: string;
    sender: {
      profile: {
        id: string;
        name: string;
        avatarUrl: string;
      };
    };
    msgView: {
      member: {
        profileId: string;
      };
    }[];
  }[];
}
export interface ChatMembersDto {
  id: string;
  creatorId: string;
  members: {
    id: string;
    isApproved: boolean;
    profile: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
}
export interface MessageViewDto {
  id: string;
  sender: {
    profileId: string;
  };
  msgView: {
    viewedAt: Date;
    member: {
      profile: {
        id: string;
        name: string;
        avatarUrl: string;
      };
    };
  }[];
}
