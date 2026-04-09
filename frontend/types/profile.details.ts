export interface OwnProfileResponse {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  followers?: {
    id: string;
  };
  followings?: {
    id: string;
  };
  story?: {
    id: string;
  };
  sentNotifications?: {
    id: string;
  };
}

export interface Follow {
  id: string;
}
export interface Story {
  id: string;
}
export interface Notifications {
  id: string;
}

export interface ProfileState {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  followers: Follow[];
  followings?: Follow[];
  story: Story;
  sentNotifications: Notifications[];

  setId: (id: string) => void;
  setName: (name: string) => void;
  setBio: (bio: string) => void;
  setAvatar: (avatarUrl: string) => void;
  setFollowers: (followers: Follow[]) => void;
  setFollowinngs: (followings: Follow[]) => void;
  setStory: (story: Story) => void;
  setNotification: (sentNotifications: Notifications[]) => void;
}
