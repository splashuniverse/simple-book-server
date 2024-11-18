import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RequestReservationDto {
  @IsNotEmpty()
  @IsNumber()
  placeId: number;
}

export class EditStatusReservationDto {
  @IsNotEmpty()
  @IsNumber()
  reservationId: number;
}

export class CompleteReservationDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}
