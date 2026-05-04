export interface followDto {
  followerId: string;
  followingId: string;
}
export interface FollowFromProfileDto {
  id: string;
  followers: {
    followerId: string;
  }[];
}
