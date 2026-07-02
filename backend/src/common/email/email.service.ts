import { Injectable, InternalServerErrorException, Logger, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { SendEmailDto } from './email.dto';
import { EmailDto } from 'src/auth/dto/async.work';
import { Resend } from 'resend';
@Injectable()
export class EmailService {
  private mailTransport: Transporter;
  private resend: Resend;
  private logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.getOrThrow('RESEND_API_KEY'));
    // this.mailTransport = createTransport({
    //   host: this.configService.get('MAIL_HOST'),
    //   port: Number(this.configService.get('MAIL_PORT')),
    //   secure: false,
    //   auth: {
    //     user: this.configService.get('MAIL_USER'),
    //     pass: this.configService.get('MAIL_PASSWORD'),
    //   },
    // });
  }

  // async sendEmail(data: SendEmailDto): Promise<{ success: boolean } | null> {
  //   const { receipents, subject, html, text } = data;

  //   const mailOptions: SendMailOptions = {
  //     // from: sender ?? {
  //     //   name: this.configService.get('MAIL_SENDER_NAME_DEFAULT'),
  //     //   address: this.configService.get('MAIL_SENDER_DEFAULT'),
  //     // },
  //     from: 'Social',
  //     to: receipents,
  //     subject,
  //     html, // valid HTML body
  //     text, // plain text body
  //   };

  //   try {
  //     await this.mailTransport.sendMail(mailOptions);
  //     return { success: true };
  //   } catch (error) {
  //     throw new NotImplementedException(error);
  //   }
  // }

  async sendGmail(emailData: EmailDto) {
    // const transporter = createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: this.configService.getOrThrow<string>('EMAIL_PROVIDER'),
    //     pass: this.configService.getOrThrow<string>('EMAIL_PASSWORD'),
    //   },
    // });
    // await transporter.sendMail({
    //   from: this.configService.get<string>(
    //     'MAIL_SENDER_DEFAULT',
    //     'echonet@gmail.com',
    //   ),
    //   to: data.to,
    //   subject: data.subject,
    //   text: data.text,
    //   html: data.html,
    // });

    const { data, error } = await this.resend.emails.send({
      from: `Suhan <${this.configService.getOrThrow('MAIL_SENDER')}>`,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
    });

    if (error) {
      this.logger.error({ error });
      throw new InternalServerErrorException(error.message);
    }
    if (data) {
      this.logger.log({ data });
      return;
    }
  }
}
