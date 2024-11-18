import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';

@Injectable()
export class UploadService implements MulterOptionsFactory {
  // Multer 설정
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 파일 크기 제한
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(
            new Error('이미지 파일만 업로드할 수 있습니다.'),
            false,
          );
        }
        callback(null, true);
      },
    };
  }

  async saveProfileImage(
    file: Express.Multer.File,
    originalName: string,
    userId: number,
  ): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(originalName);
    const filename = `profile-${uniqueSuffix}${ext}`;
    const userDirectory = join(
      __dirname,
      '..',
      '..',
      'buckets',
      'user',
      userId.toString(),
    );

    fs.mkdirSync(userDirectory, { recursive: true });

    const destinationPath = join(userDirectory, filename);
    fs.writeFileSync(destinationPath, file.buffer);

    // 정적 URL 반환
    return `https://6707-211-207-25-41.ngrok-free.app/static/user/${userId}/${filename}`;
  }

  async savePlaceAttachment(
    file: Express.Multer.File,
    placeId: number,
  ): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `place-${uniqueSuffix}${ext}`;
    const placeDirectory = join(
      __dirname,
      '..',
      '..',
      'buckets',
      'place',
      placeId.toString(),
    );

    fs.mkdirSync(placeDirectory, { recursive: true });

    const destinationPath = join(placeDirectory, filename);
    fs.writeFileSync(destinationPath, file.buffer);

    return `https://6707-211-207-25-41.ngrok-free.app/static/place/${placeId}/${filename}`;
  }

  async saveSplashImage(file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `splashimage-${uniqueSuffix}${ext}`;
    const placeDirectory = join(__dirname, '..', '..', 'buckets', 'splash');

    fs.mkdirSync(placeDirectory, { recursive: true });

    const destinationPath = join(placeDirectory, filename);
    fs.writeFileSync(destinationPath, file.buffer);

    return `https://6707-211-207-25-41.ngrok-free.app/static/splash/${filename}`;
  }
}
