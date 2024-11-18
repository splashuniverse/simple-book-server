import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { AccessTokenRequest } from 'src/interfaces/auth.interface';
import {
  RequestReservationDto,
  EditStatusReservationDto,
  CompleteReservationDto,
} from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  /**
   * app
   */
  @Get('/')
  @Version('1')
  @UseGuards(AuthGuard)
  async getReservationList(
    @Req() req: AccessTokenRequest,
    @Param('date') date?: string,
  ) {
    return await this.reservationService.getReservationList(req.userId, date);
  }

  @Post('/')
  @Version('1')
  @UseGuards(AuthGuard)
  async requestReservation(
    @Req() req: AccessTokenRequest,
    @Body() dto: RequestReservationDto,
  ) {
    return await this.reservationService.requestReservation(req.userId, dto);
  }

  @Patch('/cancle')
  @Version('1')
  @UseGuards(AuthGuard)
  async cancleReservation(
    @Req() req: AccessTokenRequest,
    @Body() dto: EditStatusReservationDto,
  ) {
    return await this.reservationService.cancleReservation(req.userId, dto);
  }

  /**
   * backoffice
   */
  @Patch('/approve')
  async approveRequestReservation(@Body() dto: EditStatusReservationDto) {
    return await this.reservationService.approveRequestReservation(
      dto.reservationId,
    );
  }

  @Patch('/reject')
  async rejectRequestReservation(@Body() dto: EditStatusReservationDto) {
    return await this.reservationService.rejectRequestReservation(
      dto.reservationId,
    );
  }

  /**
   * etc
   */
  @Patch('/complete')
  async completeReservation(@Body() dto: CompleteReservationDto) {
    return await this.reservationService.completeReservation(dto);
  }
}
