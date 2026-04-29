import { Job } from 'bullmq';

export interface JobParentData {
  postId: string;
  profileId: string;
}

export interface JobChildData {
  postId: string;
  media: {
    originalname: string;
    mimetype: string;
    fieldName: string;
    destination: string;
    filename: string;
    path: string;
    buffer: string; // base64 string
  };
}

export type PostJob =
  | (Job<JobParentData> & { name: 'batch-complete' })
  | (Job<JobChildData> & { name: 'process-task' });
