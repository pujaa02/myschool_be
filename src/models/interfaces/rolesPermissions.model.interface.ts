import { RequiredKey } from './common.model.interface';
import { status } from './user.model.interface';

export interface RolesPermissionsAttributes {
  role_id: number;
  permission_id: number;
  status?: status;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredRolesPermissionsAttributes = RequiredKey<
  RolesPermissionsAttributes, 'permission_id' | 'role_id'
>;
