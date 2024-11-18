import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { AccessTokenRequest } from 'src/interfaces/auth.interface';
import { AutoLoginDto, LoginDto, LogoutDto, SignupDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Version('1')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @Post('/login')
  @Version('1')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post('/auto-login')
  @Version('1')
  @UseGuards(AuthGuard)
  async autoLogin(@Req() req: AccessTokenRequest, @Body() dto: AutoLoginDto) {
    return await this.authService.autoLogin(req.userId, req.token, dto);
  }

  @Delete('/logout')
  @Version('1')
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }

  @Get('/terms')
  async getTerms() {
    return await this.authService.getTerms();
  }

  @Post('/check-available-email')
  async checkAvailableEmail(@Body('email') email: string) {
    return await this.authService.checkAlreadyAccount(email);
  }

  @Post('/refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
