export type SlideType = "image" | "video" | "imageAudio";

export interface Stories {
  id: string;
  order: number;
}

export interface StoryState {
  story: string;
  stories: StoryMedia[] | [];
  isUploaded: boolean;
  expiresAt: string;

  setStory: (story: string | undefined) => void;
  setExpiresAt: (expiresAt: string | undefined) => void;
  setIsUploaded: (isUploaded: boolean) => void;
  setStories: (stories: StoryMedia[]) => void;
  addStory: (story: StoryMedia) => void;
  deleteStory: (storyId: string) => void;
  removeStory: () => void;
}
export interface StoryProcessing {
  status: "processing";
}
export interface StoryUploaded {
  status: "processing" | "successfull";
  storyId: string;
  expiresAt: string;
}
export type StoryResponseType = StoryUploaded | StoryProcessing;
export interface StoryStatusResponse {
  status: "processing" | "successfull"; // if uploding in background => processing and  'successfull' only after checking that exact number is saved in pg
}
export type MediaType = "IMG" | "VIDEO" | "COMBINED";
export interface StoryMedia {
  id: string;
  captcha?: string | null;
  mediaType: MediaType;
  mediaUrl: string;
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
