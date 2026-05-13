import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatDto } from '../dto/chat.dto';

@Injectable()
export class ValidateChatPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(chatId: string): Promise<ChatDto> {
    const chat = await this.prisma.chat.findUniqueOrThrow({
      where: { id: chatId },
      select: {
        id: true,
        type: true,
        name: true,
        creatorId: true,
        members: {
          select: {
            id: true,
            profileId: true,
            isApproved: true,
          },
        },
      },
    });
    return chat;
  }
}
