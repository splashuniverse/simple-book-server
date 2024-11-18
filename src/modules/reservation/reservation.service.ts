import { ConflictException, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { Place, PlaceRepository } from 'src/database/place';
import { Reservation, ReservationRepository } from 'src/database/reservation';
import { ReviewRepository } from 'src/database/review';
import { SubscriptionRepository } from 'src/database/subscription';
import { PLACE_STATUS, RESERVATION_STATUS } from 'src/enum';
import { Between, In } from 'typeorm';
import { QrCodeService } from '../qrcode.service';
import {
  RequestReservationDto,
  EditStatusReservationDto,
  CompleteReservationDto,
} from './reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly reservationRepo: ReservationRepository,
    private readonly placeRepo: PlaceRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly reviewRepo: ReviewRepository,
  ) {}

  async requestReservation(userId: number, dto: RequestReservationDto) {
    const queryRunner =
      this.reservationRepo.manager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const place = await queryRunner.manager.getRepository(Place).findOne({
        where: { id: dto.placeId, status: PLACE_STATUS.WAITING },
      });

      if (!place) {
        throw new ConflictException('해당 장소가 없거나 예약만료 되었습니다.');
      }

      const [, reservationCount] = await queryRunner.manager
        .getRepository(Reservation)
        .findAndCount({
          where: {
            place: {
              id: dto.placeId,
            },
            status: RESERVATION_STATUS.APPROVED,
          },
        });

      if (
        place.maxUserCount !== null &&
        place.maxUserCount < reservationCount + 1
      ) {
        throw new ConflictException('예약이 마감되었습니다.');
      }

      await this.reservationRepo.save(
        this.reservationRepo.create({
          user: {
            id: userId,
          },
          place: {
            id: dto.placeId,
          },
        }),
      );

      await queryRunner.commitTransaction();

      return { message: '예약 성공' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancleReservation(userId: number, dto: EditStatusReservationDto) {
    await this.reservationRepo.update(
      {
        id: dto.reservationId,
        user: {
          id: userId,
        },
      },
      {
        status: RESERVATION_STATUS.CANCEL,
      },
    );

    return { message: '예약취소 성공' };
  }

  async getReservationList(userId: number, date?: string) {
    // 1. 대기 상태인 장소 리스트 가져오기
    const places = await this.placeRepo.find({
      where: { status: In([PLACE_STATUS.WAITING, PLACE_STATUS.IN_PROGRESS]) },
      relations: ['partner'], // Partner 관계를 포함하여 가져오기
    });

    // 2. 해당 사용자의 예약 리스트 가져오기
    let dateCondition = {};

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      dateCondition = { startDate: Between(startOfDay, endOfDay) };
    }

    const reservations = await this.reservationRepo.find({
      where: { user: { id: userId }, ...dateCondition },
      relations: ['place'],
    });

    // 3. 해당 사용자의 구독 리스트 가져오기
    const subscriptions = await this.subscriptionRepo.find({
      where: { user: { id: userId } },
      relations: ['partner'],
    });

    // 4. 사용자가 구독 중인 파트너의 ID 목록 생성
    const subscribedPartnerIds = subscriptions.map(
      (subscription) => subscription.partner.id,
    );

    // 5. 장소 리스트를 필터링하여 사용자가 구독 중인 파트너의 장소만 포함
    const filteredPlaces = places.filter((place) =>
      subscribedPartnerIds.includes(place.partner.id),
    );

    const reviews = await this.reviewRepo.find({
      relations: ['user', 'place'],
      where: {
        user: {
          id: userId,
        },
        place: {
          id: In(filteredPlaces.map((item) => item.id)),
        },
      },
    });
    console.log(reviews);

    // 6. 장소 리스트에 예약 상태 및 reservationId 추가
    const placeListWithStatus = filteredPlaces.map((place) => {
      // 해당 장소에 대한 사용자의 예약 상태 확인
      const userReservation = reservations.find(
        (reservation) => reservation.place.id === place.id,
      );
      const userReview = reviews.find(
        (review) => review.user.id === userId && review.place.id === place.id,
      );

      return {
        ...place,
        reservationId: userReservation ? userReservation.id : null, // 예약 ID가 없으면 null
        reservationStatus: userReservation ? userReservation.status : null, // 예약 상태가 없으면 null
        reservationQrUrl: userReservation ? userReservation.qrCodeUrl : null,
        isWriteReview: !!userReview,
      };
    });

    return {
      reservations: placeListWithStatus,
      markedDates: Array.from(
        new Set(
          placeListWithStatus.map((item) =>
            format(item.startDate, 'yyyy-MM-dd'),
          ),
        ),
      ),
    };
  }

  async approveRequestReservation(reservationId: number) {
    const updateResult = await this.reservationRepo.update(
      {
        id: reservationId,
        status: RESERVATION_STATUS.REQUESTED,
      },
      {
        status: RESERVATION_STATUS.APPROVED,
      },
    );

    if (updateResult.affected === 0) {
      throw new ConflictException('예약승인 실패');
    }

    return { message: '예약승인 성공' };
  }

  async rejectRequestReservation(reservationId: number) {
    const updateResult = await this.reservationRepo.update(
      {
        id: reservationId,
        status: RESERVATION_STATUS.REQUESTED,
      },
      {
        status: RESERVATION_STATUS.REJECT,
      },
    );

    if (updateResult.affected === 0) {
      throw new ConflictException('예약거절 실패');
    }

    return { message: '예약거절 성공' };
  }

  async completeReservation(dto: CompleteReservationDto) {
    const decrypted = this.qrCodeService.decryptQrCode(dto.value);

    const updateResult = await this.reservationRepo.update(
      {
        id: decrypted.reservationId,
        user: { id: decrypted.userId },
        status: RESERVATION_STATUS.WAITING,
      },
      {
        status: RESERVATION_STATUS.COMPLETED,
      },
    );

    if (!updateResult.affected) {
      throw new ConflictException('예약상태가 올바르지 않습니다.');
    }

    return { message: '입장완료 성공' };
  }
}
