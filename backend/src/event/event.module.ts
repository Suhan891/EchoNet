import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { EventService } from './event.service';
import { EventGateway } from './event.gateway';

@Module({
  imports: [CommonModule],
  providers: [EventService, EventGateway],
  exports: [EventService],
})
export class EventModule {}
