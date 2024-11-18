import { Injectable } from '@nestjs/common';
import { PartnerRepository } from 'src/database/partner';
import { SubscriptionRepository } from 'src/database/subscription';
import { In } from 'typeorm';
import { SubscriptionDto } from './subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly partnerRepo: PartnerRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
  ) {}

  async getSubscriptionList(userId: number, isUserSubscription: boolean) {
    let subscriptions = await this.partnerRepo.getSubscriptionList(
      userId,
      isUserSubscription,
    );
    subscriptions = subscriptions.map((item) => ({
      ...item,
      isSubscribed: !!Number(item.isSubscribed),
    }));
    console.log(subscriptions);
    console.log('sungju');

    return { subscriptions };
  }

  async getSubScriptionDetail(partnerId: number) {
    const detail = await this.partnerRepo.findOneOrFail({
      relations: ['places', 'places.attachments', 'places.reviews'],
      where: { id: partnerId },
    });

    return { detail };
  }

  async registerSubscription(userId: number, dto: SubscriptionDto) {
    await this.subscriptionRepo.save(
      dto.partnerIds.map((partnerId) => ({
        partner: {
          id: partnerId,
        },
        user: {
          id: userId,
        },
      })),
    );

    return { message: '구독성공' };
  }

  async deleteSubscription(userId: number, dto: SubscriptionDto) {
    await this.subscriptionRepo.delete({
      user: {
        id: userId,
      },
      partner: { id: In(dto.partnerIds) },
    });

    return { message: '구독해제 성공' };
  }
}
