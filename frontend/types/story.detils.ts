export interface Stories {
  id: string;
  order: number;
}

export interface StoryMediaOwnResponse {
  mediaType: string;
  mediaUrl: string;
  order: number;
  likes: {
    id: string;
    profileId: string;
  }[];
  storyViews: {
    id: string;
    viewer: {
      name: string;
      avatarUrl: string;
    };
  }[];
}

export interface StoryMediaOthersResponse {
  mediaType: string;
  mediaUrl: string;
  order: number;
}

export type StoryMediaResponse = StoryMediaOwnResponse | StoryMediaOthersResponse;