import { RequiredKey } from './common.interface';

export interface ClassesAttributes {
  id?: number;
  class_name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredClassAttributes = RequiredKey<ClassesAttributes, 'id'>;
