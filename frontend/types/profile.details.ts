export interface OwnProfileResponse {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  story?: {
    id: true;
  };
  _count: {
    followers: number;
    followings: number;
    sentNotifications: number;
  };
}

interface Follower {
  id: string;
}
interface Following {
  id: string;
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
  followers?: number | null;
  followings?: number | null;
  story: boolean;
  sentNotifications: Notifications[] | undefined;

  setId: (id: string) => void;
  setName: (name: string) => void;
  setBio: (bio: string | undefined) => void;
  setAvatar: (avatarUrl: string) => void;
  setFollowers: (followers: number | null) => void;
  setFollowinngs: (followings: number | null) => void;
  setStory: (story: boolean) => void;
  setNotification: (sentNotifications: Notifications[] | undefined) => void;
}

export interface UpProfileResult {
  bio: string;
  name: string;
  id: string;
}
