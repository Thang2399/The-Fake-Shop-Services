import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User_Role_Enum } from '@/src/common/enum/user.enum';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('request.headers role middleware', req.headers);
    const headers = req.headers;
    const userId = headers['x-user-id'] || '';
    const userName = headers['x-user-name'] || '';
    const email = headers['x-user-email'] || '';
    const userRole = headers['x-user-role'] || User_Role_Enum.USER;

    next();
  }
}
