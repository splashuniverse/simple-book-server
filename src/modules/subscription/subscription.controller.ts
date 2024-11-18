import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { TokenValidationGuard, AuthGuard } from 'src/guard/auth.guard';
import { AccessTokenRequest } from 'src/interfaces/auth.interface';
import { SubscriptionDto } from './subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('/')
  @Version('1')
  @UseGuards(AuthGuard)
  async getSubscriptionList(
    @Req() req: AccessTokenRequest,
    @Query('isUserSubscription') isUserSubscription: boolean,
  ) {
    return await this.subscriptionService.getSubscriptionList(
      req.userId,
      isUserSubscription,
    );
  }

  @Get('/:partnerId')
  @Version('1')
  @UseGuards(TokenValidationGuard)
  async getSubScriptionDetail(@Param('partnerId') partnerId: number) {
    return await this.subscriptionService.getSubScriptionDetail(partnerId);
  }

  @Post('/')
  @Version('1')
  @UseGuards(AuthGuard)
  async registerSubscription(
    @Req() req: AccessTokenRequest,
    @Body() dto: SubscriptionDto,
  ) {
    return await this.subscriptionService.registerSubscription(req.userId, dto);
  }

  @Delete('/')
  @Version('1')
  @UseGuards(AuthGuard)
  async deleteSubscription(
    @Req() req: AccessTokenRequest,
    @Body() dto: SubscriptionDto,
  ) {
    return await this.subscriptionService.deleteSubscription(req.userId, dto);
  }
}
