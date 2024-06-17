import { Injectable, NestMiddleware } from '@nestjs/common';
import { TokenMiddleware } from '@/src/shared/middleware/token.middleware';
import { RoleMiddleware } from '@/src/shared/middleware/role.middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenMiddleware: TokenMiddleware,
    private readonly roleMiddleware: RoleMiddleware,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Chain both middleware functions
    this.tokenMiddleware.use(req, res, () => {
      this.roleMiddleware.use(req, res, next);
    });
  }
}
