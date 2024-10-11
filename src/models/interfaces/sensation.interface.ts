import { RequiredKey } from './common.interface';

export interface SensationAttributes {
  id?: number;
  user_id?: number;
  image?: string;
  title?: string;
  description?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredSensationAttributes = RequiredKey<SensationAttributes, 'id'>;
