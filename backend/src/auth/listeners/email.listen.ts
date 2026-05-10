import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import type { EmailEvent } from '../dto/async.work';

@Injectable()
export class AuthListener {
  constructor(@InjectQueue('email') private queue: Queue) {}
  private readonly logger = new Logger(AuthListener.name);

  @OnEvent('email.verify')
  async handleVerify(event: EmailEvent) {
    await this.queue.add(`verify`, event);
    this.logger.log(`${event.email} started for Verification`);
  }

  @OnEvent('email.forgot-pass')
  async handleForgotPass(event: EmailEvent) {
    await this.queue.add('forgot-pass', event);
    this.logger.log(`${event.email} started for Forgot Password handle`);
  }
}
