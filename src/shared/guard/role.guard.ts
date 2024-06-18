import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User_Role_Enum } from '@/src/common/enum/user.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token, userRole } = this.extractUserRoleFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    } else if (
      userRole !== User_Role_Enum.SUPER_ADMIN &&
      userRole !== User_Role_Enum.ADMIN
    ) {
      throw new ForbiddenException();
    }

    return true;
  }

  private extractUserRoleFromHeader(request: Request) {
    const isTokenExpired = request.headers['x-is-token-expired'] || 'false';
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    const userRole = request.headers['x-user-role'] || User_Role_Enum.USER;

    return {
      token: type === 'Bearer' && isTokenExpired !== 'true' ? token : undefined,
      userRole,
    };
  }
}
