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
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { RequiredStudentAttributes, StudentsAttributes } from './interfaces/students.model.interface';
import User from './user.model';
import Class from './class.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';
import ExamResults from './examResult.model';
import StudentAttendance from './studentAttendance.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'students',
})
export default class Student extends Model<StudentsAttributes, RequiredStudentAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.STRING)
  name: string;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  user_id: number;

  @ForeignKey(() => Class)
  @Column(DataTypes.INTEGER)
  class_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // =========== Associations =============

  @BelongsTo(() => User, { foreignKey: 'user_id', constraints: false })
  user: User;

  @BelongsTo(() => Class, { foreignKey: 'class_id', constraints: false })
  class: Class;

  @HasMany(() => ExamResults, { foreignKey: 'student_id', constraints: false })
  examResult: ExamResults[];

  @HasMany(() => StudentAttendance, { foreignKey: 'student_id', constraints: false })
  studentAttendace: StudentAttendance[];

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(student: Student) {
    sanitizeHtmlFieldsAllModules(student);
  }
}
