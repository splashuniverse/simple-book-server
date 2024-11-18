import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'] || '';
    const clientIp = req.ip;
    const method = req.method;
    const url = req.url;
    const startTime = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const status = res.statusCode;
      const body = req.body || {};

      const logMessage = {
        clientIp,
        method,
        url,
        body,
        status,
        resTime: `${responseTime} ms`,
        userAgent,
      };

      this.logger.log(`Request Log: ${JSON.stringify(logMessage, null, 2)}`);
    });

    next();
  }
}
