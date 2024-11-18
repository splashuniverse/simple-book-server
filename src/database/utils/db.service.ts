import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AUTH_PROVIDER, RESERVATION_STATUS } from 'src/enum';
import { Repository } from 'typeorm';
import { Partner } from '../partner';
import { Place } from '../place';
import { Reservation } from '../reservation';
import { AppVersion, SplashImage } from '../server';
import { Subscription } from '../subscription';
import { Terms } from '../terms';
import { User } from '../user.entity';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(AppVersion)
    private readonly appVersionRepo: Repository<AppVersion>,
    @InjectRepository(SplashImage)
    private readonly splashImageRepo: Repository<SplashImage>,
    @InjectRepository(Terms)
    private readonly termsRepo: Repository<Terms>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  async onModuleInit() {
    // 서버 시작 시 데이터가 없으면 기본 데이터 삽입
    await this.splashImageRepo.save([
      {
        imageUrl:
          'https://6707-211-207-25-41.ngrok-free.app/static/splash/splashimage-1731030145503-200885401.PNG',
        isActive: true,
      },
    ]);

    await this.appVersionRepo.save([
      {
        version: '1.0',
        minSupportedVersion: '1.0',
        isMandatory: true,
        updateUrl: 'https://naver.com',
      },
    ]);

    await this.termsRepo.save([
      {
        terms: '이용약관 동의',
        privacy: '개인정보 수집 및 이용 동의',
        location: '위치 정보 수집 및 이용 동의',
        marketing: '마케팅 및 광고 수신 동의',
      },
    ]);

    // await this.userRepo.save([
    //   {
    //     name: '우성주',
    //     email: 'lifecoder10@gmail.com',
    //     provider: AUTH_PROVIDER.GOOGLE,
    //     socialUId: 'Aq95fsABOZP7vPh8bxANZh0C1Y72',
    //     terms: {
    //       id: 1,
    //     },
    //   },
    // ]);

    await this.partnerRepo.save([
      {
        partnerName: '금천구',
        category: '주거',
        managerName: '홍길동',
        managerPhoneNumber: '010-1234-1234',
        introduction: '자취 핫플레이스',
      },
      {
        partnerName: '동작구',
        category: '놀이',
        managerName: '김하나',
        managerPhoneNumber: '010-1234-4234',
        introduction: '신림 핫플레이스',
      },
    ]);

    await this.placeRepo.save([
      {
        name: '다이소 퍼블릭가산점',
        address1: '서울 금천구 디지털로 178',
        address2: 'A동 지하1층',
        latitude: 37.4764394057239,
        longitude: 126.887331650246,
        partner: {
          id: 1,
        },
        startDate: new Date('2024-11-17T15:00:00'),
        endDate: new Date('2024-11-17T22:00:00'),
        content: '다이소 매대 위치를 외울 수 있습니다.',
        maxUserCount: 2,
      },
      {
        name: '금천소방서 지상차고',
        address1: '서울 금천구 시흥대로 342',
        address2: '1층',
        latitude: 37.4641358331914,
        longitude: 126.897934083993,
        partner: {
          id: 1,
        },
        startDate: new Date('2024-11-17T15:00:00'),
        endDate: new Date('2024-11-17T22:00:00'),
        content: '소방서 체험을 할 수 있습니다.',
        maxUserCount: 1,
      },
      {
        name: '삼성스토어 금천',
        address1: '서울 금천구 시흥대로 357',
        address2: '1층',
        latitude: 37.4654198825153,
        longitude: 126.89712400752,
        partner: {
          id: 1,
        },
        startDate: new Date('2024-11-17T15:00:00'),
        endDate: new Date('2024-11-17T22:00:00'),
        content: '갤럭시폰을 체험 할 수 있습니다.',
        maxUserCount: 3,
      },
      {
        name: '셜록홈즈 신림2호점',
        address1: '서울 관악구 신림로 327',
        address2: '지하1층',
        latitude: 37.4834741441709,
        longitude: 126.929571432545,
        partner: {
          id: 2,
        },
        startDate: new Date('2024-11-17T15:00:00'),
        endDate: new Date('2024-11-17T22:00:00'),
        content: '방탈출',
        maxUserCount: 5,
      },
      {
        name: '보드게임카페 레드버튼 신림점',
        address1: '서울 관악구 신림로 323',
        address2: '3층',
        latitude: 37.4832285155747,
        longitude: 126.929548484921,
        partner: {
          id: 2,
        },
        startDate: new Date('2024-11-17T15:00:00'),
        endDate: new Date('2024-11-17T22:00:00'),
        content: '보드게임카페',
        maxUserCount: 5,
      },
    ]);

    // this.subscriptionRepo.save([
    //   {
    //     partner: {
    //       id: 1,
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   },
    // ]);

    // this.reservationRepo.save([
    //   {
    //     status: RESERVATION_STATUS.WAITING,
    //     qrCodeUrl:
    //       'https://6707-211-207-25-41.ngrok-free.app/static/qr.html?value=fd3f5d1a0e53f730a2bbe1d3311a1618',
    //     place: {
    //       id: 1,
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   },
    //   {
    //     status: RESERVATION_STATUS.REJECT,
    //     qrCodeUrl: null,
    //     place: {
    //       id: 2,
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   },
    // ]);
  }
}
