import type { IEmailTransporter } from '../interfaces/IEmailTransporter.js';
import nodemailer from 'nodemailer';

export class NodeMailer implements IEmailTransporter {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(email: string, subject:string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
  }
}
