import { InjectDataSource } from '@nestjs/typeorm';
import { PLACE_STATUS } from 'src/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Repository,
  DataSource,
  Index,
} from 'typeorm';
import { Partner } from './partner';
import { User } from './user.entity';

@Index(['partner', 'user'], { unique: true })
@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.subscriptions)
  partner: Partner;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;
}

export class SubscriptionRepository extends Repository<Subscription> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Subscription, dataSource.createEntityManager());
  }

  async getSubscriptionList(partnerId: number) {
    return await this.createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.partner', 'partner')
      .leftJoinAndSelect('partner.places', 'place', 'place.status != :status', {
        status: PLACE_STATUS.COMPLETED,
      })
      .where('subscription.partner.id = :partnerId', { partnerId })
      .getMany();
  }
}
