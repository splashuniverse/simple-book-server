import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { EditStatusPlaceDto, RegisterReviewDto } from './place.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { AccessTokenRequest } from 'src/interfaces/auth.interface';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  /**
   * app
   */
  @Post('/:placeId/review')
  @Version('1')
  @UseGuards(AuthGuard)
  async registerReview(
    @Req() req: AccessTokenRequest,
    @Param('placeId') placeId: number,
    @Body() dto: RegisterReviewDto,
  ) {
    return await this.placeService.registerReview(req.userId, placeId, dto);
  }

  /**
   * etc
   */
  @Patch('/active')
  async activePlace(@Body() dto: EditStatusPlaceDto) {
    return await this.placeService.activePlace(dto);
  }

  @Patch('/complete')
  async completePlace(@Body() dto: EditStatusPlaceDto) {
    return await this.placeService.completePlace(dto);
  }
}
