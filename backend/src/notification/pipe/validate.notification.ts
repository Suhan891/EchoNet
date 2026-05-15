import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotifyType } from '../dto/notification.dto';

@Injectable()
export class NotificationPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}
  async transform(notiFyId: string): Promise<NotifyType> {
    const notification = await this.prisma.notification.findUniqueOrThrow({
      where: { id: notiFyId },
      select: {
        isRead: true,
        id: true,
        chatId: true,
        purpose: true,
        storyId: true,
        reelId: true,
        postId: true,
      },
    });
    if (notification.purpose === 'STORY' && notification.storyId)
      return {
        format: { type: 'STORY', storyId: notification.storyId },
        id: notification.id,
        isRead: notification.isRead,
      };

    if (notification.purpose === 'CHAT' && notification.chatId)
      return {
        format: { type: 'CHAT', chatId: notification.chatId },
        id: notification.id,
        isRead: notification.isRead,
      };
    if (notification.purpose === 'REEL' && notification.reelId)
      return {
        format: { type: 'REEL', reelId: notification.reelId },
        id: notification.id,
        isRead: notification.isRead,
      };

    if (notification.purpose === 'POST' && notification.postId)
      return {
        format: { type: 'POST', postId: notification.postId },
        id: notification.id,
        isRead: notification.isRead,
      };
    console.log(notification);
    if (notification.purpose === 'MESSAGE' && notification.chatId)
      return {
        format: { type: 'CHAT', chatId: notification.chatId },
        id: notification.id,
        isRead: notification.isRead,
      };

    throw new Error('Invalid notification data');
  }
}
