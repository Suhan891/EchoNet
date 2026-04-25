import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobData } from '../dto/job.status.view.dto';

@Injectable()
export class JobValidatePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(jobId: string): Promise<JobData> {
    const job = await this.prisma.job.findFirst({
      where: { id: jobId },
      select: {
        id: true,
        status: true,
        userId: true,
        jobId: true,
        name: true,
      },
    });
    if (!job) throw new BadRequestException('Invalid job id');
    return job;
  }
}
