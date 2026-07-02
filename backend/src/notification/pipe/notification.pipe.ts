import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifyRemoveDto } from '../dto/notification.dto';

@Injectable()
export class NotifyRemovePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(notifyId: string): Promise<NotifyRemoveDto> {
    const notify = await this.prisma.notification.findUnique({
      where: { id: notifyId },
      select: {
        id: true,
        receiverId: true,
      },
    });

    if (!notify) throw new BadRequestException('No such notification exists');

    return notify;
  }
}
