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
    posts: number;
    savedPosts: number;
    reels: number;
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
  posts: boolean;
  savedPosts: boolean;
  reels: boolean;
  followers: number;
  followings: number;
  story: boolean;
  sentNotifications: Notifications[] | undefined;

  setId: (id: string) => void;
  setPosts: (posts: boolean) => void;
  setSavedPosts: (savedPosts: boolean) => void;
  setReels: (reels: boolean) => void;
  setName: (name: string) => void;
  setBio: (bio: string | undefined) => void;
  setAvatar: (avatarUrl: string) => void;
  setFollowers: (followers: number) => void;
  setFollowinngs: (followings: number) => void;
  setStory: (story: boolean) => void;
  setNotification: (sentNotifications: Notifications[] | undefined) => void;
}

export interface UpProfileResult {
  bio: string;
  name: string;
  id: string;
}
