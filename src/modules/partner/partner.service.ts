import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PartnerRepository } from 'src/database/partner';
import { PlaceAttachmentRepository, PlaceRepository } from 'src/database/place';
import { ReservationRepository } from 'src/database/reservation';
import { In } from 'typeorm';
import { UploadService } from '../upload.service';
import {
  AddPlacesDto,
  DeletePlacesDto,
  PermitReservationDto,
  RegisterPartnerDto,
} from './partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    private readonly partnerRepo: PartnerRepository,
    private readonly uploadService: UploadService,
    private readonly placeRepo: PlaceRepository,
    private readonly placeAttachmentRepo: PlaceAttachmentRepository,
    private readonly reservationRepo: ReservationRepository,
  ) {}

  async registerPartner(dto: RegisterPartnerDto) {
    await this.partnerRepo.save(this.partnerRepo.create(dto));
    return { message: '파트너 생성 성공' };
  }

  async deletePartner(partnerId: number) {
    await this.partnerRepo.delete(partnerId);
    return { message: '파트너 삭제 성공' };
  }

  async addPlaces(partnerId: number, dto: AddPlacesDto) {
    try {
      const placeList = dto.places.map((place) => ({
        ...place,
        partner: { id: partnerId },
      }));
      await this.placeRepo.bulkdAddPlace(placeList);
      return { message: '장소 추가 성공' };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('유효하지 않은 파트너입니다.');
    }
  }

  async deletePlaces(partnerId: number, dto: DeletePlacesDto) {
    try {
      await this.placeRepo.delete({
        partner: {
          id: partnerId,
        },
        id: In(dto.placeIds),
      });
      return { message: '장소 삭제 성공' };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('유효하지 않은 파트너입니다.');
    }
  }

  async uploadPlaceAttachments(placeId: number, files: Express.Multer.File[]) {
    console.log(files);

    const urls = await Promise.all(
      files.map((file) => {
        return this.uploadService.savePlaceAttachment(file, placeId);
      }),
    );

    const attachments = urls.map((url, index) => ({
      place: { id: placeId },
      url,
      order: index,
    }));
    return await this.placeAttachmentRepo.save(attachments);
  }

  async permitReservation(partnerId: number, dto: PermitReservationDto) {
    await this.reservationRepo.editStatusForPartner(partnerId, dto);

    return { message: '예약 상태 수정 성공' };
  }
}
