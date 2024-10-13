import { RequiredKey } from './common.model.interface';

export interface CellMmebersAttributes {
  id?: number;
  name?: string;
  committe_id?: number;
  member_image?: string;
  user_id?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredCellMemberAttributes = RequiredKey<CellMmebersAttributes, 'id'>;
