import { Module } from '@nestjs/common';
import { UserRepository } from 'src/database/user.repository';
import { UploadService } from '../upload.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UploadService, UserRepository],
})
export class UserModule {}
