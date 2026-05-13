import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtVerify } from 'src/auth/tokens/token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server, ServerOptions } from 'socket.io';
import { AuthenticatedSocket } from './dto/event.dto';
import { WsException } from '@nestjs/websockets';

export class AuthenicatedSocketAdapter extends IoAdapter {
  private readonly jwtVerify: JwtVerify;
  private readonly prisma: PrismaService;
  private readonly logger = new Logger(AuthenicatedSocketAdapter.name);

  constructor(private app: INestApplicationContext) {
    super(app);
    this.jwtVerify = this.app.get(JwtVerify);
    this.prisma = this.app.get(PrismaService);
  }

  createIOServer(port: number, options: ServerOptions) {
    const serverOptions: ServerOptions = {
      ...options,
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET'],
        credentials: true,
      },
    };

    const server = super.createIOServer(port, serverOptions) as Server;

    server.use((socket: AuthenticatedSocket, next) => {
      void (async (): Promise<void> => {
        const auth = socket.handshake.auth as {
          token?: string;
          profileId?: string;
        };
        const token = auth.token?.split(' ')[1] as string;
        const profileId = auth.profileId as string;

        if (!token || !profileId)
          return next(new WsException('All conditions not satisfied'));
        const payload = this.jwtVerify.accessToken(token);

        if (!payload) throw new WsException('Token has expired');

        const user = await this.prisma.user.findUniqueOrThrow({
          where: { id: payload?.sub },
          select: {
            id: true,
            profile: {
              select: {
                id: true,
                isActive: true,
              },
            },
          },
        });

        const activeProfile = user.profile.find(
          (prof) => prof.isActive === true,
        );
        if (!activeProfile) throw new WsException('No active profile found');
        if (activeProfile.id !== profileId)
          throw new WsException('Active profile Id not matching');

        socket.data = {
          userId: user.id,
          profileId: profileId,
        };

        next();
      })();
    });

    return server;
  }
}
