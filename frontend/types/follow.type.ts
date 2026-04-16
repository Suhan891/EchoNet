export interface FollowState {
  followers: Followers[] | [];
  followings: Followings[] | [];
  setFollowers: (followers: Followers[]) => void;
  setFollowings: (Followings: Followings[]) => void;
  addfollowing: (following: Followings) => void;
  removefollowing: (followingId: string) => void;
}

export interface Followers {
  id: string;
  followerId: string;
  follower: {
    avatarUrl: string;
    name: string;
  };
}

export interface Followings {
  id: string;
  followingId: string;
  following: {
    avatarUrl: string;
    name: string;
  };
}
