import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PLACE_STATUS } from 'src/enum';
import { AddPlaceDto } from 'src/modules/partner/partner.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Repository,
  DataSource,
} from 'typeorm';
import { Partner } from './partner';
import { Reservation } from './reservation';
import { Review } from './review';

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 250 })
  address1: string;

  @Column({ type: 'varchar', length: 250 })
  address2: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({
    type: 'enum',
    enum: PLACE_STATUS,
    default: PLACE_STATUS.WAITING,
  })
  status: PLACE_STATUS;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', nullable: true })
  maxUserCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Partner, (partner) => partner.places)
  partner: Partner;

  @OneToMany(() => PlaceAttachment, (attachment) => attachment.place, {
    cascade: true,
  })
  attachments: PlaceAttachment[];

  @OneToMany(() => Review, (review) => review.place, {
    cascade: true,
  })
  reviews: Review[];

  @OneToMany(() => Reservation, (reservation) => reservation.place, {
    cascade: true,
  })
  reservations: Reservation[];
}

@Entity('place_attachments')
export class PlaceAttachment {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => Place, (place) => place.attachments)
  place: Place;

  @Column({ type: 'varchar', length: 250 })
  url: string;

  @Column({ type: 'int' })
  order: number;
}

@Injectable()
export class PlaceRepository extends Repository<Place> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Place, dataSource.createEntityManager());
  }

  async bulkdAddPlace(places: AddPlaceDto[]): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into(Place)
      .values(places)
      .execute();
  }
}

@Injectable()
export class PlaceAttachmentRepository extends Repository<PlaceAttachment> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(PlaceAttachment, dataSource.createEntityManager());
  }
}
