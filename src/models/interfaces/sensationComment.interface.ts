import { RequiredKey } from './common.interface';

export interface SensationCommentsAttributes {
  id?: number;
  user_id?: number;
  sensation_id?: number;
  comment?: string;
  isDeleted?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredSensationCommentAttributes = RequiredKey<SensationCommentsAttributes, 'id'>;
