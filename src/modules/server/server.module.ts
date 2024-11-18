import { Module } from '@nestjs/common';
import {
  AppVersionRepository,
  SplashImageRepository,
} from 'src/database/server';
import { FirebaseService } from '../firebase.service';
import { MailService } from '../mail.service';
import { UploadService } from '../upload.service';
import { ServerController } from './server.controller';

@Module({
  controllers: [ServerController],
  providers: [
    UploadService,
    FirebaseService,
    MailService,
    SplashImageRepository,
    AppVersionRepository,
  ],
})
export class ServerModule {}
