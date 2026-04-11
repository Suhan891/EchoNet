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

interface Follower {
  id: string;
  follower: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}
interface Following {
  id: string;
  followings: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}
export type Follow = Follower | Following;
export interface Notifications {
  id: string;
}

export interface ProfileState {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  followers?: Follower[];
  followings?: Following[];
  storyId: string;
  sentNotifications: Notifications[];

  setId: (id: string) => void;
  setName: (name: string) => void;
  setBio: (bio: string) => void;
  setAvatar: (avatarUrl: string) => void;
  setFollowers: (followers: Follower[]) => void;
  setFollowinngs: (followings: Following[]) => void;
  setStoryId: (storyId: string) => void;
  setNotification: (sentNotifications: Notifications[]) => void;
}

export interface UpProfileResult {
  bio: string;
  name: string;
  id: string;
}
