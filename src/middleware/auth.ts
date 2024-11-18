import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['Authorization'];
    if (!authHeader)
      throw new UnauthorizedException('Authorization 헤더가 없습니다.');

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      req.token = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
}
