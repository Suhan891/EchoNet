export interface AllProfiles {
  id: string;
  name: string;
  avatarUrl: string;
}
export interface ProfileDto {
  id: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  isPrivate: boolean;
  story?: {
    id: string;
  };
  _count: {
    posts: number;
    reels: number;
    followers: number;
    followings: number;
  };
}
export interface PostReelDto {
  profileId: string;
  type: "REEL" | "POST";
  count: number;
}
