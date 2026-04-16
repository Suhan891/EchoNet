import { Stories } from "./story.detils";

export interface OwnProfileResponse {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  _count: {
    followers: number;
    followings: number;
    story: number;
    sentNotifications: number;
  };
}

interface Follower {
  id: string;
  // follower: {
  //   id: string;
  //   name: string;
  //   avatarUrl: string;
  // };
}
interface Following {
  id: string;
  // followings: {
  //   id: string;
  //   name: string;
  //   avatarUrl: string;
  // };
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
