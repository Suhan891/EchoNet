import { Socket } from 'socket.io';

export interface ActiveProfile {
  id: string;
  userId: string;
  name?: string;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    profileId: string;
  };
}
