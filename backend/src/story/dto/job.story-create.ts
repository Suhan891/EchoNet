import { SlideType } from './story.create.dto';

export interface UploadJobFile {
  originalname: string;
  mimetype: string;
  buffer: string; // base64 string
}
export interface JobStoryCreateDto {
  type: SlideType;
  caption?: string;
  storyId: string;

  imageFile?: UploadJobFile;
  videoFile?: UploadJobFile;
  audioFile?: UploadJobFile;

  order: number;
}
