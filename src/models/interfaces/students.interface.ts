import { RequiredKey } from './common.interface';

export interface StudentsAttributes {
  id?: number;
  name?: string;
  user_id?: number;
  class_id?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredStudentAttributes = RequiredKey<StudentsAttributes, 'id'>;
