import { RequiredKey } from './common.model.interface';
import { UserAttributes } from './user.model.interface';
import { RoleAttributes } from './role.model.interface';

export type UserRoleAttributes = {
  id?: number;
  role_id: number;
  user_id: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
  user?: Partial<UserAttributes>;
  role?: Partial<RoleAttributes>;
};

export type RequiredUserRoleAttributes = RequiredKey<UserRoleAttributes, 'role_id' | 'user_id' >;
