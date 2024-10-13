import { RequiredKey } from './common.model.interface';

export interface StudentAttendanceAttributes {
  id?: number;
  student_id?: number;
  attendance_date?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredStudentAttendanceAttributes = RequiredKey<StudentAttendanceAttributes, 'id'>;
