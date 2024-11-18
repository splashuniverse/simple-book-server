import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/utils/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LoggerMiddleware } from './middleware/logger';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PartnerModule } from './modules/partner/partner.module';
import { PlaceModule } from './modules/place/place.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { GlobalModule } from './global.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ServerModule } from './modules/server/server.module';
import { CSPMiddleware } from './middleware/csp';

@Module({
  imports: [
    GlobalModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'buckets'),
      serveRoot: '/static',
      exclude: ['/api/{.*}'],
    }),
    AuthModule,
    UserModule,
    PartnerModule,
    PlaceModule,
    SubscriptionModule,
    ReservationModule,
    ServerModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(CSPMiddleware)
      .forRoutes('*');
  }
}
