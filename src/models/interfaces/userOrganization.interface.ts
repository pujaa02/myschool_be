import { RequiredKey } from './common.model.interface';
import { USER_STATUS, UserAttributes } from './user.model.interface';

export type UserOrganizationAttributes = {
  id?: number;
  organization_id: number;
  user_id: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
  user_status:USER_STATUS
};

export type RequiredUserOrganizationAttributes = RequiredKey<UserOrganizationAttributes, 'user_id' | 'organization_id'>;
