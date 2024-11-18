import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as firebase from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/constants/message.constant';
import { TermsRepository } from 'src/database/terms';
import { UserDeviceInfo, UserLoginLog } from 'src/database/user.entity';
import {
  UserDeviceInfoRepository,
  UserLoginLogRepository,
  UserRepository,
} from 'src/database/user.repository';
import { AUTH_PROVIDER, LOGIN_LOG_TYPE } from 'src/enum';
import { QueryRunner } from 'typeorm';
import { FirebaseService } from '../firebase.service';
import {
  AutoLoginDto,
  DeviceInfoDto,
  LoginDto,
  LogoutDto,
  SignupDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userDeviceInfoRepo: UserDeviceInfoRepository,
    private readonly userLoginLogRepo: UserLoginLogRepository,
    private readonly termsRepo: TermsRepository,
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { provider, token, deviceInfo } = dto;

    try {
      const userVerifyInfo = await this.firebaseService.validateTokenForUser(
        token,
      );

      if (AUTH_PROVIDER.EMAIL === provider && !userVerifyInfo.emailVerified) {
        throw new UnauthorizedException('이메일 인증이 완료되지 않았습니다.');
      }

      const user = await this.userRepo.getUserProfileBySocialUIdOrFail(
        userVerifyInfo.uid,
      );
      const currentDeviceInfo = await this.getCurrentDeviceInfoByUserId(
        user.id,
        deviceInfo,
      );

      const loginLog = await this.saveLoginLog(
        user.id,
        currentDeviceInfo.id,
        LOGIN_LOG_TYPE.LOGIN,
      );

      const accessToken = this.generateAccessToken(user.id);
      const refreshToken = this.generateRefreshToken(user.id);

      await this.updateLoginLogWithRefreshToken(loginLog.id, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async autoLogin(userId: number, token: string, dto: AutoLoginDto) {
    const { deviceInfo } = dto;

    await this.userRepo.validateUserExistence(userId);

    const currentDeviceInfo = await this.getCurrentDeviceInfoByUserId(
      userId,
      deviceInfo,
    );

    const loginLog = await this.saveLoginLog(
      userId,
      currentDeviceInfo.id,
      LOGIN_LOG_TYPE.AUTO_LOGIN,
    );

    await this.updateLoginLogWithRefreshToken(loginLog.id, token);

    return { message: '자동로그인 성공' };
  }

  async signup(dto: SignupDto) {
    const {
      provider,
      name,
      pictureUrl,
      email,
      password,
      socialUId,
      agreeTerms,
      agreePrivacy,
      agreeLocation,
      agreeMarketing,
    } = dto;
    let userInfoInFirebase: UserRecord;
    let queryRunner: QueryRunner;

    try {
      queryRunner = this.userRepo.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (AUTH_PROVIDER.EMAIL === provider) {
        userInfoInFirebase = await firebase.auth().createUser({
          email,
          password,
        });
      }

      const termsId = await this.termsRepo.findLatestId();

      await this.userRepo.save(
        this.userRepo.create({
          name,
          email,
          pictureUrl,
          provider,
          socialUId: socialUId || userInfoInFirebase.uid,
          agreeTerms,
          agreePrivacy,
          agreeLocation,
          agreeMarketing,
          terms: {
            id: termsId,
          },
        }),
      );

      if (AUTH_PROVIDER.EMAIL === provider) {
        await this.firebaseService.sendVerificationEmail(email);
      }

      await queryRunner.commitTransaction();

      return { message: SUCCESS_MESSAGE.AUTH.SEND_VERIFICATION_EMAIL };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (userInfoInFirebase) {
        await firebase.auth().deleteUser(userInfoInFirebase.uid);
      }

      if ('auth/email-already-exists' === error?.errorInfo?.code) {
        throw new ConflictException(ERROR_MESSAGE.AUTH.ALREADY_EMAIL_EXISTS);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async logout(dto: LogoutDto) {
    const { refreshToken, deviceInfo } = dto;
    const loggedOutAt = new Date();
    const loginLog = await this.userLoginLogRepo.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!loginLog) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const currentDeviceInfo = await this.getCurrentDeviceInfoByUserId(
      loginLog.user.id,
      deviceInfo,
    );

    // 로그아웃 시간 기록
    await this.saveLoginLog(
      loginLog.user.id,
      currentDeviceInfo.id,
      LOGIN_LOG_TYPE.LOGOUT,
      loggedOutAt,
      refreshToken,
    );

    return { message: '로그아웃 성공' };
  }

  async getTerms() {
    try {
      return await this.termsRepo.getLatestTermsOrFail();
    } catch (error) {
      throw error;
    }
  }

  async checkAlreadyAccount(email: string) {
    const userInfo = await this.userRepo.findOneBy({ email });

    if (userInfo) {
      throw new ConflictException(ERROR_MESSAGE.AUTH.ALREADY_EMAIL_EXISTS);
    } else {
      return { message: SUCCESS_MESSAGE.AUTH.AVAILABLE_USE_EMAIL };
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const logRepo = this.userRepo.manager.getRepository(UserLoginLog);
    const loginLog = await logRepo.findOne({ where: { refreshToken } });

    if (!loginLog || loginLog.loggedOutAt) {
      throw new ForbiddenException('유효하지 않은 리프레시 토큰입니다.');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new ForbiddenException('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  private generateAccessToken(userId: number) {
    return this.jwtService.sign({
      uid: userId, // 어떤 ID 인지 모르게 네이밍
    });
  }

  private generateRefreshToken(userId: number) {
    return this.jwtService.sign(
      {
        uid: userId, // 어떤 ID 인지 모르게 네이밍
      },
      { expiresIn: '365d' },
    );
  }

  private async getCurrentDeviceInfoByUserId(
    userId: number,
    deviceInfo: DeviceInfoDto,
  ) {
    const existingDevices = await this.userDeviceInfoRepo.getDeviceRowsByUserId(
      userId,
    );
    const deviceExists = existingDevices.some((device) => {
      return device.uid === deviceInfo.uid;
    });
    let targetDevice: UserDeviceInfo;

    if (deviceExists) {
      targetDevice = existingDevices.find(
        (device) => device.uid === deviceInfo.uid,
      );
    } else {
      targetDevice = await this.userDeviceInfoRepo.save(
        this.userDeviceInfoRepo.create({
          ...deviceInfo,
          user: { id: userId },
        }),
      );
    }

    return targetDevice;
  }

  private async saveLoginLog(
    userId: number,
    deviceId: number,
    type: LOGIN_LOG_TYPE,
    loggedOutAt?: Date,
    refreshToken?: string,
  ) {
    return await this.userLoginLogRepo.save(
      this.userLoginLogRepo.create({
        user: {
          id: userId,
        },
        deviceInfo: {
          id: deviceId,
        },
        type,
        refreshToken,
        loggedOutAt,
      }),
    );
  }

  private async updateLoginLogWithRefreshToken(
    loginLogId: number,
    refreshToken: string,
  ) {
    await this.userLoginLogRepo.update(loginLogId, { refreshToken });
  }
}
