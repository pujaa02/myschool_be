import { RequiredKey } from './common.model.interface';

export interface RolesPermissionsAttributes {
  id?: number;
  role_id?: number;
  permission_id?: number;
  feature_id?: number;
  role_permission_key?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

// export type RequiredRolesPermissionsAttributes = RequiredKey<
//   RolesPermissionsAttributes, 'permission_id' | 'role_id'
// >;
