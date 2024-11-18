import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/user.repository';
import { UploadService } from '../upload.service';
import { UserProfileUpdateDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly userRepo: UserRepository,
  ) {}

  async getUserProfile(userId: number) {
    return await this.userRepo.getUserProfileByUserIdOrFail(userId);
  }

  async updateUserProfile(
    userId: number,
    dto: UserProfileUpdateDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });

    if (file) {
      const profileImageUrl = await this.uploadService.saveProfileImage(
        file,
        file.originalname,
        userId,
      );
      user.pictureUrl = profileImageUrl;
    }

    if (dto.birthDate) {
      user.birthDate = new Date(dto.birthDate);
    }

    if (dto.agreeMarketing !== undefined) {
      user.agreeMarketing = dto.agreeMarketing;
    }

    const updateReesult = await this.userRepo.update(userId, {
      pictureUrl: user.pictureUrl,
      birthDate: user.birthDate,
      agreeMarketing: user.agreeMarketing,
    });

    if (!updateReesult.affected) {
      throw new ConflictException('프로필 업데이트 실패');
    }

    return await this.getUserProfile(userId);
  }
}
