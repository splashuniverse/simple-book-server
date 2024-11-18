import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from 'src/constants/message.constant';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Repository,
  DataSource,
} from 'typeorm';

@Entity('terms')
export class Terms {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'terms', type: 'text' })
  terms: string;

  @Column({ name: 'privacy', type: 'text' })
  privacy: string;

  @Column({ name: 'location', type: 'text' })
  location: string;

  @Column({ name: 'marketing', type: 'text' })
  marketing: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Injectable()
export class TermsRepository extends Repository<Terms> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Terms, dataSource.createEntityManager());
  }

  async findLatestId(): Promise<number> {
    const latestTermsId = await this.createQueryBuilder()
      .select('id')
      .orderBy('id', 'DESC')
      .getRawOne();

    if (!latestTermsId) {
      throw new NotFoundException(ERROR_MESSAGE.AUTH.NOT_FOUND_TERMS);
    }

    return latestTermsId.id;
  }

  async getLatestTermsOrFail(): Promise<Terms | null> {
    const res = await this.createQueryBuilder()
      .select('terms')
      .addSelect('privacy')
      .addSelect('location')
      .addSelect('marketing')
      .orderBy('id', 'DESC')
      .getRawOne();

    if (!res) {
      throw new NotFoundException(ERROR_MESSAGE.AUTH.NOT_FOUND_TERMS);
    }

    return res;
  }
}
