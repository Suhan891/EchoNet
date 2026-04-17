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

export interface ImageMedia {
  storyId: string;
  type: 'image';
  imageFile: Express.Multer.File;
  caption?: string;
  order: number;
}
export interface VideoMedia {
  storyId: string;
  type: 'video';
  videoFile: Express.Multer.File;
  caption?: string;
  order: number;
}
export interface ImageAudioMedia {
  storyId: string;
  type: 'imgAudio';
  imageFile: Express.Multer.File;
  audioFile: Express.Multer.File;
  caption?: string;
  order: number;
}

export type StoryCreateDto = ImageAudioMedia | ImageMedia | VideoMedia;

export type CacheStatus = 'processing' | 'successfull' | 'failed';
