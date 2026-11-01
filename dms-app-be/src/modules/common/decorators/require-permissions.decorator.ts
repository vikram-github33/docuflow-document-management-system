import { SetMetadata } from '@nestjs/common';
import { Permission } from '../permissions/permission';

export const REQUIRE_PERMISSIONS = 'require_permissions';

export const RequirePermissions = (...Permissions: Permission[]) => {
  return SetMetadata(REQUIRE_PERMISSIONS, Permissions);
};
