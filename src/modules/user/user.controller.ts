import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/auth.guard';
import { AccessTokenRequest } from 'src/interfaces/auth.interface';
import { UserProfileUpdateDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @Version('1')
  @UseGuards(AuthGuard)
  async getUserProfile(@Req() req: AccessTokenRequest) {
    return await this.userService.getUserProfile(req.userId);
  }

  @Patch('/profile')
  @Version('1')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfile(
    @Req() req: AccessTokenRequest,
    @Body() dto: UserProfileUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.userService.updateUserProfile(req.userId, dto, file);
  }
}
