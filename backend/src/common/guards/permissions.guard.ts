import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();
    if (!requiredPermissions) {
      return true;
    }
    if (!user || !Array.isArray(user.permissions)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }
    const hasAll = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
    if (!hasAll) {
      throw new ForbiddenException(
        'You do not have sufficient permissions to perform this action.',
      );
    }
    return true;
  }
}
