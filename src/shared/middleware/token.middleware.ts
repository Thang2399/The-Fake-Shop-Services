// src/common/middleware/auth.middleware.ts

import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Access the Authorization header value
    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader) {
      console.log('authorizationHeader', authorizationHeader);

      // Store the value in the request object
      req['accessToken'] = authorizationHeader.startsWith('Bearer')
        ? authorizationHeader.replace('Bearer ', '')
        : authorizationHeader;

      // Pass control to the next middleware or route handler
      next();
    }
    // else {
    //   return res
    //     .status(HttpStatus.UNAUTHORIZED)
    //     .json({ message: 'Unauthorized' });
    // }
  }
}
