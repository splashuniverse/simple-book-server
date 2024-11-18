import { Module } from '@nestjs/common';
import { PartnerRepository } from 'src/database/partner';
import { SubscriptionRepository } from 'src/database/subscription';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PartnerRepository, SubscriptionRepository],
})
export class SubscriptionModule {}
