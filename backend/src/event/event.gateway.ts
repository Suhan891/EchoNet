import {
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

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private eventService: EventService) {}

  async handleConnection(client: AuthenticatedSocket) {
    //const userId = client.data.userId;
    const profileId = client.data.profileId;
    await this.eventService.createOnline(profileId);
    const onlineProfiles = await this.eventService.getAllOnline();
    client.broadcast.emit('joined', profileId);
    client.emit('active_profiles', onlineProfiles);
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    //const userId = client.data.userId;
    const profileId = client.data.profileId;
    await this.eventService.markOffline(profileId); // Sending all profiles that this profileId is inactive
    this.server.emit('left', profileId);
  }

  // Server sends
  sendNotification(profileId: string, payload: unknown) {
    this.server.to(profileId).emit('new_notification', payload);
  }

  // @SubscribeMessage('create_chat')
  // handleMessage(@MessageBody() profileId: string, client: AuthenticatedSocket) {
  //   // Call a event => To bull mq for notification
  // }
}
