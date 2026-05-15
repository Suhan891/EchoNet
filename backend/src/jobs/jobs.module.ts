import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { BullModule } from '@nestjs/bullmq';
import { JobValidatePipe } from './pipe/job.validate.pipe';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'story-task' }), CommonModule],
  controllers: [JobsController],
  providers: [JobsService, JobValidatePipe],
})
export class JobsModule {}
