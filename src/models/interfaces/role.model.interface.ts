import { RequiredKey } from './common.model.interface';
import RolePermission from '../rolesPermissions.model';
import { UserRoleAttributes } from './userRole.model.interface';

export interface RoleAttributes {
  id: number;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  role_permissions?: Partial<RolePermission>[];
  user_roles?: Partial<UserRoleAttributes>[];
}

export type RequiredRoleAttributes = RequiredKey<RoleAttributes, 'name'>;
