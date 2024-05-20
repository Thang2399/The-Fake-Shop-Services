import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const isTokenExpired = request.headers['x-is-token-expired'] || 'false';
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' && isTokenExpired !== 'true' ? token : undefined;
  }
}
