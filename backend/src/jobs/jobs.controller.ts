import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ResponseMessage } from 'src/common/decorators/response-message';
import { CurrentUser } from 'src/common/gaurds/current-user.decorator';
import type { authUserDto } from 'src/auth/tokens/token.dto';
import { JobValidatePipe } from './pipe/job.validate.pipe';
import type { JobData } from './dto/job.status.view.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobService: JobsService) {}

  @Get(':id')
  @ResponseMessage('Status update received')
  async getStatus(
    @CurrentUser() user: authUserDto,
    @Param('id', ParseUUIDPipe, JobValidatePipe) jobData: JobData,
  ) {
    return await this.jobService.jobStatus(user, jobData);
  }
}
