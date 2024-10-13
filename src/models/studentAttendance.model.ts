import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import {
  RequiredStudentAttendanceAttributes,
  StudentAttendanceAttributes,
} from './interfaces/studentAttendance.model.interface';
import Student from './student.model';
import { sanitizeHtmlFieldsAllModules } from '@/helper/common.helper';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'student_attendance',
})
export default class StudentAttendance extends Model<StudentAttendanceAttributes, RequiredStudentAttendanceAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => Student)
  @Column(DataTypes.INTEGER)
  student_id: number;

  @Column(DataTypes.DATE)
  attendance_date: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // =========== Associations =============

  @BelongsTo(() => Student, { foreignKey: 'student_id', constraints: false })
  student: Student;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(studentAttendance: StudentAttendance) {
    sanitizeHtmlFieldsAllModules(studentAttendance);
  }
}
