import { status } from './user.model.interface';

export interface PermissionGroupAttributes {
  id?: number;
  name: string;
  parent_section: string;
  child_section: string;
  status?: status;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;
}
