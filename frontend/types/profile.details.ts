export interface OwnProfileResponse {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  isPrivate: boolean;
  story?: {
    id: true;
  };
  followers: {
    followerId: string;
  }[];
  followings: {
    followingId: string;
  }[];
  _count: {
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
  posts: number;
  savedPosts: number;
  reels: number;
  followers: string[] ;
  followings: string[];
  story: boolean;
  isPrivate: boolean;
  sentNotifications: Notifications[] | undefined;

  setId: (id: string) => void;
  setPosts: (posts: number) => void;
  setSavedPosts: (savedPosts: number) => void;
  setReels: (reels: number) => void;
  setName: (name: string) => void;
  setBio: (bio: string | undefined) => void;
  setAvatar: (avatarUrl: string) => void;
  setFollowers: (followers: string[] | []) => void;
  setFollowinngs: (followings: string[] | []) => void;
  setStory: (story: boolean) => void;
  setIsPrivate: (isPrivate: boolean) => void;
  setNotification: (sentNotifications: Notifications[] | undefined) => void;
}

export interface UpProfileResult {
  bio: string;
  name: string;
}
