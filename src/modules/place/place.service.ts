import { ConflictException, Injectable } from '@nestjs/common';
import { PlaceRepository } from 'src/database/place';
import { ReservationRepository } from 'src/database/reservation';
import { ReviewRepository } from 'src/database/review';
import { PLACE_STATUS, RESERVATION_STATUS } from 'src/enum';
import { QrCodeService } from '../qrcode.service';
import { EditStatusPlaceDto, RegisterReviewDto } from './place.dto';

@Injectable()
export class PlaceService {
  constructor(
    private readonly qrcodeService: QrCodeService,
    private readonly placeRepo: PlaceRepository,
    private readonly reservationRepo: ReservationRepository,
    private readonly reviewRepo: ReviewRepository,
  ) {}

  async activePlace(dto: EditStatusPlaceDto) {
    const updatePlaceResult = await this.placeRepo.update(
      {
        id: dto.placeId,
        status: PLACE_STATUS.WAITING,
      },
      {
        status: PLACE_STATUS.IN_PROGRESS,
      },
    );

    if (!updatePlaceResult.affected) {
      throw new ConflictException('예약오픈 실패');
    }

    const reservationList = await this.reservationRepo.find({
      relations: ['user'],
      where: {
        place: {
          id: dto.placeId,
        },
      },
    });
    console.log(reservationList);

    const updatePromises = reservationList.map(async (reservation) => {
      const qrCodeUrl = await this.qrcodeService.generateQrCode(
        reservation.user.id,
        reservation.id,
      );
      console.log(qrCodeUrl);

      const data = {
        reservationId: reservation.id,
        userId: reservation.user.id,
        status: RESERVATION_STATUS.WAITING,
        qrCodeUrl,
      };

      console.log(data);

      return data;
    });

    const updatedReservations = await Promise.all(updatePromises);

    for (const {
      reservationId,
      userId,
      status,
      qrCodeUrl,
    } of updatedReservations) {
      const updateResult = await this.reservationRepo.update(
        { id: reservationId, user: { id: userId } },
        { status, qrCodeUrl },
      );

      if (!updateResult.affected) {
        throw new ConflictException('예약건 처리 실패');
      }
    }

    return { message: '예약오픈 성공' };
  }

  async completePlace(dto: EditStatusPlaceDto) {
    const updatePlaceResult = await this.placeRepo.update(
      {
        id: dto.placeId,
        status: PLACE_STATUS.IN_PROGRESS,
      },
      {
        status: PLACE_STATUS.COMPLETED,
      },
    );

    if (!updatePlaceResult.affected) {
      throw new ConflictException('예약마감 실패');
    }

    return { message: '예약마감 성공' };
  }

  async registerReview(
    userId: number,
    placeId: number,
    dto: RegisterReviewDto,
  ) {
    const reservationLog = await this.reservationRepo.findOneBy({
      user: {
        id: userId,
      },
      place: {
        id: placeId,
      },
      status: RESERVATION_STATUS.COMPLETED,
    });

    if (!reservationLog) {
      throw new ConflictException('입장완료 기록이 없습니다.');
    }

    await this.reviewRepo.save(
      this.reviewRepo.create({
        ...dto,
        place: {
          id: placeId,
        },
        user: {
          id: userId,
        },
      }),
    );

    return { message: '리뷰등록 성공' };
  }
}
