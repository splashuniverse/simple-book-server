import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Repository,
  DataSource,
} from 'typeorm';
import { Place } from './place';
import { Subscription } from './subscription';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  partnerName: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ type: 'varchar', length: 10 })
  managerName: string;

  @Column({ type: 'char', length: 15 })
  managerPhoneNumber: string;

  @Column({ type: 'text' })
  introduction: string;

  @OneToMany(() => Place, (place) => place.partner)
  places: Place[];

  @OneToMany(() => Subscription, (subscription) => subscription.partner, {
    cascade: true,
  })
  subscriptions: Subscription[];
}

@Injectable()
export class PartnerRepository extends Repository<Partner> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Partner, dataSource.createEntityManager());
  }

  async getSubscriptionList(userId: number, isUserSubscription: boolean) {
    const query = this.createQueryBuilder('partner')
      .select('partner.id', 'id')
      .addSelect('partner.partnerName', 'partnerName')
      .addSelect('partner.category', 'category')
      .addSelect('partner.managerName', 'managerName')
      .addSelect('partner.managerPhoneNumber', 'managerPhoneNumber')
      .addSelect('partner.introduction', 'introduction')
      .addSelect(
        'CASE WHEN subscription.userId IS NOT NULL THEN true ELSE false END AS isSubscribed',
      )
      .leftJoin(
        'partner.subscriptions',
        'subscription',
        'subscription.userId = :userId',
        { userId },
      );

    if (isUserSubscription) {
      query.where('subscription.userId = :userId', { userId });
    }

    return query.getRawMany();
  }
}
