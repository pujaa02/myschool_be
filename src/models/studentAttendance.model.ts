import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import {
  RequiredStudentAttendanceAttributes,
  StudentAttendanceAttributes,
} from './interfaces/studentAttendance.interface';

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
}
