import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { EventService } from './event.service';
import { EventGateway } from './event.gateway';

@Module({
  imports: [CommonModule, AuthModule],
  providers: [EventService, EventGateway],
})
export class EventModule {}
