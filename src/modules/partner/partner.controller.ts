import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  AddPlacesDto,
  DeletePlacesDto,
  PermitReservationDto,
  RegisterPartnerDto,
} from './partner.dto';
import { PartnerService } from './partner.service';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('/register')
  async registerPartner(@Body() dto: RegisterPartnerDto) {
    return await this.partnerService.registerPartner(dto);
  }

  @Delete('/:partnerId')
  async deletePartner(@Param('partnerId') partnerId: number) {
    return await this.partnerService.deletePartner(partnerId);
  }

  @Post('/:partnerId/places')
  async addPlaces(
    @Param('partnerId') partnerId: number,
    @Body() dto: AddPlacesDto,
  ) {
    return await this.partnerService.addPlaces(partnerId, dto);
  }

  @Delete('/:partnerId/places')
  async deletePlaces(
    @Param('partnerId') partnerId: number,
    @Body() dto: DeletePlacesDto,
  ) {
    return await this.partnerService.deletePlaces(partnerId, dto);
  }

  @Post('/place/:placeId/attachments')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadPlaceAttachments(
    @Param('placeId') placeId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.partnerService.uploadPlaceAttachments(placeId, files);
  }

  @Patch('/:partnerId/reservations/status')
  async permitReservation(
    @Param('partnerId') partnerId: number,
    @Body() dto: PermitReservationDto,
  ) {
    return await this.partnerService.permitReservation(partnerId, dto);
  }
}
