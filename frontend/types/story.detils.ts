export interface Stories {
  id: string;
  order: number;
}

export interface StoryState {
  stories: StoryMedia[] | [];

  setStories: (stories: StoryMedia[]) => void;
  addStory: (story: StoryMedia) => void;
  deleteStory: (storyId: string) => void
  removeStory: () => void
}

export interface StoryMedia {
  id: string;
  captcha?: string | null;
  mediaType: string;
  mediaUrl: string;
  order: number;
  likes?: {
    id: string;
    profileId: string;
  }[] | [];
  storyViews?: {
    id: string;
    viewer: {
      name: string;
      avatarUrl: string;
    };
  }[] | [];
}
