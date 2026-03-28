import { SendMailOptions } from 'nodemailer';
type EmailSender = {
  name: string;
  address: string;
};
export interface SendEmailDto {
  from?: EmailSender | string;
  receipents: string | string[];
  subject: string;
  html: string;
  text: string;
}
