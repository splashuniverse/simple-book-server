import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { DatabaseService } from './db.service';
import { Terms } from '../terms';
import { Partner } from '../partner';
import { Place, PlaceAttachment } from '../place';
import { User, UserDeviceInfo, UserLoginLog } from '../user.entity';
import { Subscription } from '../subscription';
import { Reservation } from '../reservation';
import { Review } from '../review';
import { AppVersion, SplashImage } from '../server';
import { Notifications } from '../notification';

class CustomNamingStrategy extends DefaultNamingStrategy {
  tableName(className: string, customName: string): string {
    return customName || snakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.join('_')) +
      (customName || snakeCase(propertyName))
    );
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10) || 3306,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User,
          UserDeviceInfo,
          UserLoginLog,
          Terms,
          Partner,
          Place,
          PlaceAttachment,
          Subscription,
          Reservation,
          Review,
          SplashImage,
          AppVersion,
          Notifications,
        ],
        synchronize: true,
        cache: false,
        dropSchema: true,
        logging: true,
        namingStrategy: new CustomNamingStrategy(),
      }),
    }),
    TypeOrmModule.forFeature([
      SplashImage,
      AppVersion,
      Terms,
      User,
      Partner,
      Place,
      Subscription,
      Reservation,
    ]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
