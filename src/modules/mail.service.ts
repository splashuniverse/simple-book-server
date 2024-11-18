import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    // Gmail SMTP 설정
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // 이메일 전송 메서드
  async sendVerificationEmail(to: string, verificationLink: string) {
    const mailOptions = {
      from: `"SimpleBook Team" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: '이메일 인증을 완료해주세요',
      html: `
        <h1>이메일 인증</h1>
        <p>아래 링크를 클릭하여 이메일 인증을 완료하세요:</p>
        <a href="${verificationLink}">이메일 인증하기</a>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('이메일이 성공적으로 전송되었습니다:', info.messageId);
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      throw new InternalServerErrorException(
        '이메일 전송 중 오류가 발생했습니다.',
      );
    }
  }
}
