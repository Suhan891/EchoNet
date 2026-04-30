export interface PostRequestData {
  id: string;
  caption: string;
  description: string;
  postPhoto: {
    id: string;
    mediaUrl: string;
  }[];
  _count: {
    comments: number;
    likes: number;
  };
}
export interface PostData {
  id: string;
  caption: string;
  description: string;
  postPhoto: {
    id: string;
    mediaUrl: string;
  }[];
  comments: number;
  likes: number;
}
interface Posts {
  type: "POST";
  data: PostData[];
}
export interface ReelData {}
interface Reels {
  type: "REEL";
  data: ReelData[];
}
export interface StoryData {
  id: string;
  captcha?: string | null;
  mediaType: "IMG" | "VIDEO" | "COMBINED";
  mediaUrl: string;
  duration: number;
  order: number;
  likes?:
    | {
        id: string;
        profileId: string;
      }[]
    | [];
  storyViews?:
    | {
        id: string;
        viewer: {
          name: string;
          avatarUrl: string;
        };
      }[]
    | [];
}
interface Story {
  type: "STORY";
  data: StoryData[];
}
export interface SavedPostsData {}
interface SavedPost {
  type: "SAVED_MEDIA";
  data: SavedPostsData[];
}
type Store = Posts | Reels | Story | SavedPost;
export interface StoreType {
  posts: [] | PostData[];
  reels: [] | ReelData[];
  story: [] | StoryData[];
  savedPosts: [] | SavedPostsData[];

  setStore: (data: Store) => void;
}
