export type SlideType = 'image' | 'video' | 'imgAudio';

export interface ParsedSlideDto {
  type: SlideType;
  caption?: string;

  imageFile?: Express.Multer.File;
  videoFile?: Express.Multer.File;
  audioFile?: Express.Multer.File;

  order: number;
}

export type RawMultipartBody = Record<string, string>;

interface ImageSlide {
  storyId: string;
  type: 'image';
  imageFile: Express.Multer.File;
  caption?: string;
  order: number;
}
interface VideoSlide {
  storyId: string;
  type: 'video';
  videoFile: Express.Multer.File;
  caption?: string;
  order: number;
}
interface ImageAudioSlide {
  storyId: string;
  type: 'imgAudio';
  imageFile: Express.Multer.File;
  audioFile: Express.Multer.File;
  caption?: string;
  order: number;
}

export type StoryCreateDto = ImageAudioSlide | ImageSlide | VideoSlide;
