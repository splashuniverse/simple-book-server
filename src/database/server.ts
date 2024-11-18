import { InjectDataSource } from '@nestjs/typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
  DataSource,
} from 'typeorm';

@Entity('splash_images')
export class SplashImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string; // 원격 스플래시 이미지 URL

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // 현재 활성화된 이미지인지 여부

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('app_versions')
export class AppVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  version: string; // 앱 버전 (예: "1.0.0")

  @Column({ type: 'varchar', length: 10, nullable: true })
  minSupportedVersion: string; // 최소 지원 버전 (예: "1.0.0")

  @Column({ type: 'boolean', default: false })
  isMandatory: boolean; // 필수 업데이트 여부

  @Column({ type: 'varchar', length: 255, nullable: true })
  updateUrl: string; // 업데이트 URL (앱스토어 링크 등)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class SplashImageRepository extends Repository<SplashImage> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(SplashImage, dataSource.createEntityManager());
  }
}

export class AppVersionRepository extends Repository<AppVersion> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(AppVersion, dataSource.createEntityManager());
  }
}
