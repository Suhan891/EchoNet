import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { BullModule } from '@nestjs/bullmq/dist';
import { JobValidatePipe } from './pipe/job.validate.pipe';

@Module({
  imports: [BullModule.registerQueue({ name: 'story-task' })],
  controllers: [JobsController],
  providers: [JobsService, JobValidatePipe],
})
export class JobsModule {}
