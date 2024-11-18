import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ERROR_REGEX_MESSAGE } from 'src/constants/message.constant';
import { PHONE_REGEX } from 'src/constants/regex';
import { RESERVATION_STATUS } from 'src/enum';

export class RegisterPartnerDto {
  @IsNotEmpty()
  @IsString()
  managerName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PHONE_REGEX, {
    message: ERROR_REGEX_MESSAGE.PHONE_REGEX,
  })
  managerPhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  introduction: string;
}

export class AddPlaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsNotEmpty()
  @IsString()
  address2: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  maxUserCount?: number;
}

export class AddPlacesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddPlaceDto)
  places: AddPlaceDto[];
}

export class DeletePlacesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  placeIds: number[];
}

export class PermitReservationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  reservationIds: number[];

  @IsNotEmpty()
  @IsEnum(RESERVATION_STATUS)
  @IsIn([RESERVATION_STATUS.APPROVED, RESERVATION_STATUS.REJECT], {
    message: '예약 승인 또는 거절만 가능합니다.',
  })
  status: RESERVATION_STATUS;
}
