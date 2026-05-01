export interface LikeRequest {
  type: "STORY" | "POST" | "REEL";
  id: string;
}
export interface LikesData {
  profile: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: Date;
}
