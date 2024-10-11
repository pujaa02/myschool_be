import { RequiredKey } from './common.interface';

export interface SubjectsAttributes {
  id?: number;
  name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredSubjectAttributes = RequiredKey<SubjectsAttributes, 'id'>;
