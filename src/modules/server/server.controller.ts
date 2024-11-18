import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AppVersionRepository,
  SplashImageRepository,
} from 'src/database/server';
import { FirebaseService } from '../firebase.service';
import { UploadService } from '../upload.service';

@Controller('server')
export class ServerController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly firebaseService: FirebaseService,
    private readonly splashImageRepo: SplashImageRepository,
    private readonly appVersionRepo: AppVersionRepository,
  ) {}

  @Post('splashimage')
  @UseInterceptors(FileInterceptor('file'))
  async registerSplashImage(@UploadedFile() file?: Express.Multer.File) {
    if (file) {
      await this.splashImageRepo.update({}, { isActive: false });

      const imageUrl = await this.uploadService.saveSplashImage(file);

      await this.splashImageRepo.save(
        this.splashImageRepo.create({
          imageUrl,
          isActive: true, // 새 이미지 활성화
        }),
      );
    } else {
      throw new BadRequestException('이미지가 없습니다.');
    }
  }

  @Get('splashimage')
  async getSplashImage() {
    const splashimage = await this.splashImageRepo.findOneByOrFail({
      isActive: true,
    });
    return { url: splashimage.imageUrl };
  }

  @Get('app-version')
  async getAppVersion() {
    const appVersion = await this.appVersionRepo.find({
      order: {
        id: 'desc',
      },
    });
    return { version: appVersion[0] };
  }

  @Post('/fcm')
  async sendFCM(
    @Body('token') token: string,
    @Body('title') title: string,
    @Body('body') body: string,
  ) {
    this.firebaseService.sendFCM(token, title, body);
  }
}
