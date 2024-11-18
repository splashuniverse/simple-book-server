import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Repository,
  DataSource,
} from 'typeorm';
import { User } from './user.entity';
import { Place } from './place';
import { InjectDataSource } from '@nestjs/typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Place, (place) => place.reviews)
  place: Place;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}

export class ReviewRepository extends Repository<Review> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Review, dataSource.createEntityManager());
  }
}
