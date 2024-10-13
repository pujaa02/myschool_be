import { RequiredKey } from './common.model.interface';

export interface ExamAttributes {
  id?: number;
  name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredExamAttributes = RequiredKey<ExamAttributes, 'id'>;
