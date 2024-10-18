import { RequiredKey } from './common.model.interface';

export interface SystemLogAttributes {
  id: number;
  slug: string;
  module_id: number;
  feature_id: number;
  title: string;
  description: string;
  created_by: number;
  updated_by: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type RequiredSystemLogAttribute = RequiredKey<SystemLogAttributes, 'id'>;
