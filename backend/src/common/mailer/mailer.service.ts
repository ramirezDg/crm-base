import { Injectable } from '@nestjs/common';
import * as Nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = Nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(
    to: string | string[],
    subject: string,
    text: string,
    category?: string,
    html?: string,
  ) {
    const from =
      this.configService.get<string>('MAIL_FROM') ||
      '"SBG Mail" <no-reply@sistemabasegestion.com>';
    return this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      headers: category ? { 'X-Category': category } : undefined,
    });
  }
}
