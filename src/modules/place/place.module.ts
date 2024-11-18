import { Module } from '@nestjs/common';
import { PlaceRepository } from 'src/database/place';
import { ReservationRepository } from 'src/database/reservation';
import { ReviewRepository } from 'src/database/review';
import { QrCodeService } from '../qrcode.service';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';

@Module({
  controllers: [PlaceController],
  providers: [
    PlaceService,
    QrCodeService,
    PlaceRepository,
    ReservationRepository,
    ReviewRepository,
  ],
})
export class PlaceModule {}
