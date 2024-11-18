import { Module } from '@nestjs/common';
import { PlaceRepository } from 'src/database/place';
import { ReservationRepository } from 'src/database/reservation';
import { ReviewRepository } from 'src/database/review';
import { SubscriptionRepository } from 'src/database/subscription';
import { QrCodeService } from '../qrcode.service';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  controllers: [ReservationController],
  providers: [
    ReservationService,
    QrCodeService,
    ReservationRepository,
    PlaceRepository,
    SubscriptionRepository,
    ReviewRepository,
  ],
})
export class ReservationModule {}
