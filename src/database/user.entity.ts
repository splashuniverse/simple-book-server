import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { AUTH_PROVIDER, THEME, LOGIN_LOG_TYPE } from 'src/enum';
import { Terms } from './terms';
import { Review } from './review';
import { Reservation } from './reservation';
import { Subscription } from './subscription';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 10 })
  name: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  pictureUrl: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: AUTH_PROVIDER,
    nullable: false,
    default: AUTH_PROVIDER.EMAIL,
    comment: '로그인 인증 수단',
  })
  provider: AUTH_PROVIDER;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'firebase',
  })
  socialUId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fcmToken: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: THEME,
    nullable: false,
    default: THEME.SYSTEM,
  })
  theme: THEME.SYSTEM;

  @ManyToOne(() => Terms)
  @JoinColumn({ name: 'terms_id' })
  terms: Terms;

  @Column({
    type: 'boolean',
    default: true,
    comment: '이용약관 동의',
  })
  agreeTerms: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: '개인정보 수집 및 이용 동의',
  })
  agreePrivacy: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: '위치정보 수집 및 이용 동의',
  })
  agreeLocation: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: '마케팅 및 광고 수신 동의',
  })
  agreeMarketing: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserDeviceInfo, (deviceInfo) => deviceInfo.user, {
    cascade: true,
  })
  devices: UserDeviceInfo[];

  @OneToMany(() => UserLoginLog, (loginSession) => loginSession.user, {
    cascade: true,
  })
  loginLogs: UserLoginLog[];

  @OneToMany(() => Review, (review) => review.user, {
    cascade: true,
  })
  reviews: Review[];

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  reservations: Reservation[];

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
  })
  subscriptions: Subscription[];
}

@Entity('user_device_info')
export class UserDeviceInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  os: string;

  @Column({ type: 'varchar', length: 10 })
  osVersion: string;

  @Column({ type: 'varchar', length: 10 })
  version: string;

  @Column({ type: 'varchar', length: 10 })
  brand: string;

  @Column({ type: 'varchar', length: 20 })
  model: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  uid: string;

  @Column({ type: 'char', length: 15 })
  ipAddress: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'bigint' })
  freeDiskStorage: number;

  @Column({ type: 'bigint' })
  firstInstallTime: number;

  @Column({ type: 'varchar', length: 50 })
  buildId: string;

  @Column({ type: 'varchar', length: 50 })
  bundleId: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  carrierName: string;

  @Column({ type: 'tinyint' })
  emulator: boolean;

  @Column({ type: 'text' })
  abis: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.devices)
  user: User;
}

@Entity('user_login_log')
export class UserLoginLog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'enum',
    enum: LOGIN_LOG_TYPE,
    nullable: false,
    default: LOGIN_LOG_TYPE.LOGIN,
  })
  type: LOGIN_LOG_TYPE;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  loggedOutAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.loginLogs, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => UserDeviceInfo, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  deviceInfo: UserDeviceInfo;
}
