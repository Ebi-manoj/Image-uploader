import type { IEmailTransporter } from '../interfaces/IEmailTransporter.js';
import nodemailer from 'nodemailer';
import { Env } from './Env.js';

export class NodeMailer implements IEmailTransporter {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Env.EMAIL_USER,
        pass: Env.GOOGLE_APP_PASS,
      },
    });
  }

  async sendMail(email: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: Env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
  }
}
