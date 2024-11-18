import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: '1h' }, // 기본 엑세스 토큰 유효 시간 설정

      // FIXME RN 개발을 위해 한시적으로 유효기간 삭제
    }),
  ],
  exports: [JwtModule],
})
export class GlobalModule {}
