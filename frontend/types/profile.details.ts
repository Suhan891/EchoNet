export interface OwnProfileResponse {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  followers?: {
    id: string;
  }[];
  followings?: {
    id: string;
  }[];
  story?: {
    id: string;
  };
  sentNotifications?: {
    id: string;
  }[];
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
export interface Stories {
  id: string;
  storyMedia: {
    id: string;
    order: number;
  }[];
}
export interface ProfileState {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  followers?: Follower[] | undefined ;
  followings?: Following[] | undefined;
  storyId?: string;
  stories?: Stories[] | undefined;
  sentNotifications: Notifications[] | undefined;

  setId: (id: string) => void;
  setName: (name: string) => void;
  setBio: (bio: string | undefined) => void;
  setAvatar: (avatarUrl: string) => void;
  setFollowers: (followers: Follower[] | undefined ) => void;
  setFollowinngs: (followings: Following[] | undefined) => void;
  setStoryId?: (storyId: string) => void;
  setStories?: (stories: Stories[] | undefined) => void;
  setNotification: (sentNotifications: Notifications[] | undefined) => void;
}

export interface UpProfileResult {
  bio: string;
  name: string;
  id: string;
}
