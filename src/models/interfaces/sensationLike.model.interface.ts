import { RequiredKey } from './common.model.interface';

export interface SensationLikesAttributes {
  id?: number;
  user_id?: number;
  sensation_id?: number;
  isDeleted?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredSensationLikeAttributes = RequiredKey<SensationLikesAttributes, 'id'>;
