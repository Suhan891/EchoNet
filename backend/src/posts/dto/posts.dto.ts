export interface PostDto {
  id: string;
  profileId: string;
}
export interface OthersPostDto {
  id: string;
  isPrivate: boolean;
}
export interface SavePostDto {
  id: string;
  savedPosts: {
    id: string;
    profileId: string;
  }[];
  post: {
    profileId: string;
  };
}
