import { Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { SendEmailDto } from './email.dto';
import { EmailDto } from 'src/auth/dto/async.work';

@Injectable()
export class EmailService {
  private mailTransport: Transporter;

  constructor(private configService: ConfigService) {
    this.mailTransport = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: Number(this.configService.get('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(data: SendEmailDto): Promise<{ success: boolean } | null> {
    const { receipents, subject, html, text } = data;

    const mailOptions: SendMailOptions = {
      // from: sender ?? {
      //   name: this.configService.get('MAIL_SENDER_NAME_DEFAULT'),
      //   address: this.configService.get('MAIL_SENDER_DEFAULT'),
      // },
      from: 'Social',
      to: receipents,
      subject,
      html, // valid HTML body
      text, // plain text body
    };

    try {
      await this.mailTransport.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  async sendGmail(data: EmailDto) {
    const transporter = createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_PROVIDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: 'echonet@gmail.com',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  }
}
