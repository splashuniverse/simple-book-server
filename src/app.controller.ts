import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get('/health-check')
  @HttpCode(200)
  healthCheck() {
    return {
      message: 'Service is running',
    };
  }
}
