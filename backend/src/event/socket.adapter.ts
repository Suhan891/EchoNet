import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtVerify } from 'src/auth/tokens/token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server, ServerOptions } from 'socket.io';
import { AuthenticatedSocket } from './dto/event.dto';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { AppCacheService } from 'src/common/caching/redis.cache';

export class AuthenicatedSocketAdapter extends IoAdapter {
  private readonly jwtVerify: JwtVerify;
  private readonly prisma: PrismaService;
  private readonly configService: ConfigService;
  private readonly cacheService: AppCacheService;
  private readonly logger = new Logger(AuthenicatedSocketAdapter.name);

  constructor(private app: INestApplicationContext) {
    super(app);
    this.jwtVerify = this.app.get(JwtVerify);
    this.prisma = this.app.get(PrismaService);
    this.configService = this.app.get(ConfigService);
    this.cacheService = this.app.get(AppCacheService);
  }

  createIOServer(port: number, options: ServerOptions) {
    this.logger.log(`Initializing Socket.io server on port ${port}...`);
    const serverOptions: ServerOptions = {
      ...options,
      cors: {
        origin: this.configService.get<string>(
          'FRONTEND_URL',
          'http://localhost:3000',
        ),
        methods: ['GET', 'POST'],
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

        const cacheKey = `user:${payload.sub}:socket-auth`;
        let user = await this.cacheService.get<{
          id: string;
          profile: {
            id: string;
            isActive: boolean;
          }[];
        }>(cacheKey);

        if (!user) {
          user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
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
          if (!user) throw new WsException('User not found');
          await this.cacheService.set<typeof user>(cacheKey, user, 60 * 15);
        }

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

        this.logger.log(
          `Socket connection authenticated successfully. Socket ID: ${socket.id}, Profile ID: ${profileId}`,
        );

        next();
      })();
    });

    return server;
  }
}
