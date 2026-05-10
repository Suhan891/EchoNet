export interface EmailEvent {
  name: string;
  email: string;
  url: string;
}
export interface EmailDto {
  to: string;
  subject: string;
  text: string;
  html: string;
}
