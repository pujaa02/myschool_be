import { RequiredKey } from './common.model.interface';

export interface ExamResultAttributes {
  id?: number;
  student_id?: number;
  exam_id?: number;
  subject_id?: number;
  theory_total?: number;
  practical_total?: number;
  theory_obtain_mark?: number;
  practical_obtain_mark?: number;
  total_marks?: number;
  total_obtain_marks?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredExamResultsAttributes = RequiredKey<ExamResultAttributes, 'id'>;
