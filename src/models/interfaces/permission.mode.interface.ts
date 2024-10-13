import { status } from './user.model.interface';

export interface PermissionAttributes {
  id?: number;
  permission_group_id: number;
  name: string;
  order: number;
  is_disabled: boolean;
  status: status;
  created_at?: Date | string;
  updated_at?: Date | string;
}
