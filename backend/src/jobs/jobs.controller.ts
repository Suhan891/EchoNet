import { Controller, Get, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { JobValidatePipe } from './pipe/job.validate.pipe';
import type { JobData } from './dto/job.status.view.dto';
import type { profileDto } from 'src/profile/dto/profile.dto';
import { currentProfile } from 'src/profile/decorator/get-profile';

@Controller('jobs')
export class JobsController {
  constructor(private jobService: JobsService) {}

  @Get(':id')
  @ResponseMessage('Status update received')
  async getStatus(
    @currentProfile() profile: profileDto,
    @Param('id', ParseUUIDPipe, JobValidatePipe) jobData: JobData,
  ) {
    return await this.jobService.jobStatus(profile, jobData);
  }

  @Put(':id/retry')
  @ResponseMessage('Job restarted successfully')
  async retryJob(
    @currentProfile() profile: profileDto,
    @Param('id', ParseUUIDPipe, JobValidatePipe) jobData: JobData,
  ) {
    return await this.jobService.jobRetry(profile, jobData);
  }

  @Put(':id/cancel')
  @ResponseMessage('Job cancelled successfully')
  async cancelJob(
    @currentProfile() profile: profileDto,
    @Param('id', ParseUUIDPipe, JobValidatePipe) jobData: JobData,
  ) {
    return await this.jobService.jobCancel(profile, jobData);
  }
}
