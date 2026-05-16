import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { AuthenticatedSocket } from './dto/event.dto';
import { Server } from 'socket.io';
import { EventService } from './event.service';
//import { UseFilters, UseInterceptors } from 'node_modules/@nestjs/common';

import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => EventService)) private eventService: EventService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    // const userId = client.data.userId;
    const profileId = client.data.profileId;
    if (profileId) {
      await client.join(profileId);
      await this.eventService.createOnline(profileId);
      const onlineProfiles = await this.eventService.getAllOnline();
      client.broadcast.emit('joined', profileId);
      client.emit('active_profiles', onlineProfiles);
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    // const userId = client.data.userId;
    const profileId = client.data.profileId;
    if (profileId) {
      await client.leave(profileId);
      await this.eventService.markOffline(profileId); // Sending all profiles that this profileId is inactive
      this.server.emit('left', profileId);
    }
  }

  sendNotification(profileId: string, purpose?: string) {
    this.server.to(profileId).emit('notification', purpose);
  }

  sendMsg(profileId: string, chatId: string, content: string) {
    this.server.to(profileId).emit('message', { chatId, content });
  }

  @SubscribeMessage('chat_texting')
  handleMessage(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    this.server.emit(`chat:${chatId}`, client.data.profileId);
  }

  sendTexting(profileId: string, name: string) {
    this.server.to(profileId).emit('texting', name);
  }
}
