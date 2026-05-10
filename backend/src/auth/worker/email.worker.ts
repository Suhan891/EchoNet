import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/common/email/email.service';
import { EmailEvent } from '../dto/async.work';
import { Logger } from '@nestjs/common';

@Processor('email', { concurrency: 5 })
export class EmailWorker extends WorkerHost {
  private readonly logger = new Logger(EmailWorker.name);
  constructor(private emailService: EmailService) {
    super();
  }
  async process(job: Job<EmailEvent>): Promise<void> {
    switch (job.name) {
      case 'verify':
        return await this.emailVerification(job);
      case 'forgot-pass':
        return await this.emailForgotPassword(job);
    }
  }

  private async emailVerification(job: Job<EmailEvent>) {
    const data = job.data;
    const to = data.email;
    const text = `Hi ${data.name}, welcome to Social Media App! Please verify your email by following this link: ${data.url}`;
    const subject = 'Email Verification';
    const html = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2>Welcome to Social Media App!</h2>
    <p>Thanks for signing up. Please click the button below to verify your email address and get started:</p>
    <div style="margin: 30px 0;">
      <a href="${data.url}" 
         style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
         Verify Email Address
      </a>
    </div>
    <p style="font-size: 12px; color: #777;">
      If the button doesn't work, copy and paste this link into your browser: <br/>
      <span style="color: #007bff;">${data.url}</span>
    </p>
  </div>
`;
    await this.emailService.sendGmail({ to, text, subject, html });
  }

  private async emailForgotPassword(job: Job<EmailEvent>) {}

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    this.logger.log(`Email Job started: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Email job successfull for ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    const maxAttempts = job.opts.attempts ?? 3;
    const isExhausted = job.attemptsMade >= maxAttempts;

    if (!isExhausted)
      return this.logger.warn(
        `Job ${job.id} (${job.name}) retrying... attempt ${job.attemptsMade}/${maxAttempts}`,
      );
    return this.logger.error(`Email job failed: ${job.id}`, error.stack);
  }
}
