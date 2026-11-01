import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRE_PERMISSIONS } from '../decorators/require-permissions.decorator';
import { UserRole } from 'src/modules/user/user.entity';
import { Permission, ROLE_PERMISSIONS } from '../permissions/permission';

@Injectable()
export class Permissionguard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requirePermissions = this.reflector.getAllAndOverride<Permission[]>(
      REQUIRE_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );

    if (!requirePermissions || requirePermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    const userRole = user.role as UserRole;
    const userPermissions = ROLE_PERMISSIONS[userRole] ?? [];

    const hasPermission = requirePermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
