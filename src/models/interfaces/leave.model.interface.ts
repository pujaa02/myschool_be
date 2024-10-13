import { RequiredKey } from './common.model.interface';

export interface LeavesAttributes {
  id?: number;
  user_id?: number;
  leave_date?: Date | string;
  leave_reason?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredLeaveAttributes = RequiredKey<LeavesAttributes, 'id'>;
