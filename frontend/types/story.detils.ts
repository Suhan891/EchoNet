export type SlideType = "image" | "video" | "imageAudio";

export interface Stories {
  id: string;
  order: number;
}

export interface StoryDto {
  id: string;
  mediaUrl: string;
  mediaType: "IMG" | "VIDEO" | "COMBINED";
  duration: number;
  _count: {
    storyViews: true;
    likes: number;
  };
}
