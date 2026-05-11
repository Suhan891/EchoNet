import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { EventModule } from 'src/event/event.module';
import { CommonModule } from 'src/common/common.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [EventModule, CommonModule, NotificationModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
