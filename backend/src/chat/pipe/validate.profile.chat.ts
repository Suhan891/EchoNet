import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatProfileDto } from '../dto/chat.dto';

@Injectable()
export class ValidateProfilePipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(ProfName: string): Promise<ChatProfileDto> {
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { name: ProfName },
      select: {
        isPrivate: true,
        chats: {
          select: {
            chatId: true,
            chat: {
              select: {
                type: true,
                members: {
                  select: {
                    profileId: true,
                  },
                },
              },
            },
          },
        },
        id: true,
      },
    });
    return profile;
  }
}
