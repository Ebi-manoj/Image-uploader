export interface IEmailTransporter {
  sendMail(email: string, subject: string, text: string): Promise<void>;
}
