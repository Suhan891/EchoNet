import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MsgViewDto } from '../dto/message.dto';

@Injectable()
export class ValidateMessagePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(msgId: string): Promise<MsgViewDto> {
    const msg = await this.prisma.message.findUniqueOrThrow({
      where: { id: msgId },
      select: {
        id: true,
        sender: {
          select: {
            profileId: true,
          },
        },
        msgView: {
          select: {
            viewedAt: true,
            member: {
              select: {
                profile: {
                  select: {
                    id: true,
                    avatarUrl: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return msg;
  }
}
