import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BlockBadRequestsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const forbiddenPatterns = [/\.php$/, /\.asp$/, /\.aspx$/, /\.jsp$/];

    if (forbiddenPatterns.some((pattern) => pattern.test(req.url))) {
      return res.status(404).end();
    }

    next();
  }
}
