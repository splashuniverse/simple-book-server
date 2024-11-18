import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('authorization 헤더가 없습니다.');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('잘못된 authorization 형식입니다.');
    }

    try {
      const payload = this.jwtService.verify(token);
      console.log(payload);
      request.userId = payload.uid;
      request.token = token;
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}

@Injectable()
export class TokenValidationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('authorization 헤더가 없습니다.');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('잘못된 authorization 형식입니다.');
    }

    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
