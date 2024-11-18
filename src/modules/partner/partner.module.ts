import { Module } from '@nestjs/common';
import { PartnerRepository } from 'src/database/partner';
import { PlaceAttachmentRepository, PlaceRepository } from 'src/database/place';
import { ReservationRepository } from 'src/database/reservation';
import { UploadService } from '../upload.service';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

@Module({
  controllers: [PartnerController],
  providers: [
    UploadService,
    PartnerService,
    PartnerRepository,
    PlaceRepository,
    PlaceAttachmentRepository,
    ReservationRepository,
  ],
})
export class PartnerModule {}
