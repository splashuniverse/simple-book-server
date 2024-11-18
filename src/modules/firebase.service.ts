import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { readFileSync } from 'fs';
import * as path from 'path';
import { MailService } from './mail.service';

@Injectable()
export class FirebaseService {
  constructor(private readonly mailService: MailService) {
    if (firebase.apps.length === 0) {
      const firebaseConfig: any = JSON.parse(
        readFileSync(
          path.resolve(__dirname, '../../firebase-adminsdk.json'),
          'utf8',
        ),
      );
      firebase.initializeApp({
        credential: firebase.credential.cert(firebaseConfig),
      });
    }
  }

  async validateTokenForUser(token: string): Promise<UserRecord> {
    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      return await firebase.auth().getUser(decodedToken.uid);
    } catch (error) {
      throw new UnauthorizedException('존재하지 않는 계정입니다.');
    }
  }

  async sendVerificationEmail(email: string) {
    try {
      const verificationLink = await firebase
        .auth()
        .generateEmailVerificationLink(email, {
          url: 'https://simple-book-a6185.firebaseapp.com/__/auth/action?mode=action&oobCode=code',
        });

      await this.mailService.sendVerificationEmail(email, verificationLink);
    } catch (error) {
      throw error;
    }
  }

  async sendFCM(token: string, title: string, body: string) {
    try {
      console.log('sendFCM');
      console.log(token);
      console.log(title);
      console.log(body);

      await firebase.messaging().send({
        token,
        notification: {
          title,
          body,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
