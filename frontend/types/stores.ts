interface FollowReq {
  profileId: string;
}
interface LikeReq {
  type: "POST" | "REEL" | "STORY";
  id: string;
}
interface SavePost {
  mediaId: string;
}
export type Req = FollowReq | LikeReq;
export interface StoreState {
  follow?: FollowReq;
  like?: LikeReq;
  savePost?: SavePost;

  setLikeReq: (like: LikeReq | undefined) => void;
  setFollowReq: (follow: FollowReq | undefined) => void;
  setSavePost: (savePost: SavePost | undefined) => void;
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
