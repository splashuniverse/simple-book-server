import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from 'src/enum';
import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'enum',
    enum: NOTIFICATION_TYPE,
  })
  type: NOTIFICATION_TYPE;

  @Column({
    type: 'enum',
    enum: NOTIFICATION_STATUS,
  })
  status: NOTIFICATION_STATUS;

  @Column({ type: 'text' })
  data: string;
}

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }
}
