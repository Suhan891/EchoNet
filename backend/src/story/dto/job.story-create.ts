import { Job } from 'bullmq';
import { SlideType } from './story.create.dto';

export interface UploadJobFile {
  originalname: string;
  mimetype: string;
  fieldName: string;
  destination: string;
  filename: string;
  path: string;
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
export interface JobParentCreateDto {
  profileId: string;
  storyId: string;
}

export type AppJob =
  | (Job<JobStoryCreateDto> & { name: 'process-task' })
  | (Job<JobParentCreateDto> & { name: 'batch-complete' });
