import { Module } from '@nestjs/common';
import { TermsRepository } from 'src/database/terms';
import {
  UserDeviceInfoRepository,
  UserLoginLogRepository,
  UserRepository,
} from 'src/database/user.repository';
import { FirebaseService } from '../firebase.service';
import { MailService } from '../mail.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseService,
    MailService,
    UserRepository,
    UserDeviceInfoRepository,
    UserLoginLogRepository,
    TermsRepository,
  ],
})
export class AuthModule {}
