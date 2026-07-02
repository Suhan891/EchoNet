import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io'; // Use 'ws' if using a pure WS adapter

@Catch()
export class WebSocketsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(WebSocketsExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    const event = ctx.getPattern();
    let message = 'Something went wrong';

    const timestamp = new Date().toISOString();

    if (exception instanceof WsException && exception.getError()) {
      const err = exception.getError();
      if (typeof err === 'string') {
        message = err;
      } else {
        message = JSON.stringify(err);
      }
    }

    this.logger.error(`Event: ${event} | Error: ${message}`);

    const errorMsg = `Socket Error: ${message} : ${timestamp}`;
    client.emit('exception', errorMsg);
  }
}
