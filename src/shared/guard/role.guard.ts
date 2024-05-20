import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { roleAccessRight, User_Role_Enum } from '@/src/common/enum/user.enum';
import { IRoleAccessRight } from '@/src/module/item/interface/role.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token, userRole } = this.extractUserRoleFromHeader(request);
    console.log('token', token);
    console.log('userRole', userRole);

    if (!token) {
      throw new UnauthorizedException();
    }
    // else {
    //   const specificUserPermission = roleAccessRight.find(
    //     (role: IRoleAccessRight) => role.role === userRole,
    //   );
    // }

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
