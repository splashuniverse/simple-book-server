import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from 'src/constants/message.constant';
import { DataSource, Repository } from 'typeorm';
import { User, UserDeviceInfo, UserLoginLog } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async validateUserExistence(userId: number): Promise<boolean> {
    const res = await this.createQueryBuilder('')
      .select('id')
      .where('id = :userId', { userId })
      .getRawMany();

    if (!res.length) {
      throw new UnauthorizedException(ERROR_MESSAGE.AUTH.NOT_FOUND_USER);
    }

    return true;
  }

  async getUserProfileByUserIdOrFail(userId: number): Promise<User> {
    const res = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.terms', 'terms')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!res) {
      throw new UnauthorizedException(ERROR_MESSAGE.AUTH.NOT_FOUND_USER);
    }

    return res;
  }

  async getUserProfileBySocialUIdOrFail(socialUId: string): Promise<User> {
    const res = await this.createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('user.email', 'email')
      .addSelect('user.pictureUrl', 'pictureUrl')
      .addSelect('user.provider', 'provider')
      .addSelect('user.birthDate', 'birthDate')
      .addSelect('user.theme', 'theme')
      .addSelect('user.agreeTerms', 'agreeTerms')
      .addSelect('user.agreePrivacy', 'agreePrivacy')
      .addSelect('user.agreeLocation', 'agreeLocation')
      .addSelect('user.agreeMarketing', 'agreeMarketing')
      .addSelect('user.createdAt', 'createdAt')
      .where('user.social_u_id = :socialUId', { socialUId })
      .getRawOne();

    if (!res) {
      throw new UnauthorizedException(ERROR_MESSAGE.AUTH.NOT_FOUND_USER);
    }

    return res;
  }
}

@Injectable()
export class UserDeviceInfoRepository extends Repository<UserDeviceInfo> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(UserDeviceInfo, dataSource.createEntityManager());
  }

  async getDeviceRowsByUserId(userId: number) {
    const res = await this.createQueryBuilder('device')
      .where('device.userId = :userId', {
        userId,
      })
      .orderBy('device.id', 'DESC')
      .getMany();

    return res;
  }
}

@Injectable()
export class UserLoginLogRepository extends Repository<UserLoginLog> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(UserLoginLog, dataSource.createEntityManager());
  }
}
