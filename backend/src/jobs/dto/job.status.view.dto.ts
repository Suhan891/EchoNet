import { JobName, JobStatus } from 'src/generated/prisma/enums';

export interface JobData {
  id: string;
  status: JobStatus;
  userId: string;
  jobId: string;
  name: JobName;
}
