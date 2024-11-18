import { Injectable } from '@nestjs/common';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Repository,
  DataSource,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Place } from './place';
import { RESERVATION_STATUS } from 'src/enum';
import { InjectDataSource } from '@nestjs/typeorm';
import { PermitReservationDto } from 'src/modules/partner/partner.dto';

@Index(['place', 'user'], { unique: true })
@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'enum',
    enum: RESERVATION_STATUS,
    default: RESERVATION_STATUS.REQUESTED,
  })
  status: RESERVATION_STATUS;

  @Column({ type: 'varchar', length: 255, nullable: true })
  qrCodeUrl: string;

  @ManyToOne(() => Place, (place) => place.reservations)
  place: Place;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;
}

@Injectable()
export class ReservationRepository extends Repository<Reservation> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Reservation, dataSource.createEntityManager());
  }

  async editStatusForPartner(partnerId: number, dto: PermitReservationDto) {
    const reservations = await this.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.place', 'place')
      .leftJoinAndSelect('place.partner', 'partner')
      .where('reservation.id IN (:...ids)', { ids: dto.reservationIds })
      .andWhere('partner.id = :partnerId', { partnerId })
      .getMany();
    const ids = reservations.map((item) => item.id);

    return await this.createQueryBuilder()
      .update()
      .set({ status: dto.status })
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
