export interface PostDto {
  id: string;
  profileId: string;
}
export interface SavedPostDto {
  id: string;
  savedPosts: {
    profileId: string;
  }[];
  post: {
    profileId: string;
  };
}
export interface RemoveSavedPost {
  id: string;
  profileId: string;
}
export interface OthersPostDto {
  id: string;
  isPrivate: boolean;
}
