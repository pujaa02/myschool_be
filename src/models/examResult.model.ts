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
import { ExamResultAttributes, RequiredExamResultsAttributes } from './interfaces/examResult.model.interface';
import Student from './student.model';
import Exam from './exam.model';
import Subject from './subject.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'exam_results',
})
export default class ExamResults extends Model<ExamResultAttributes, RequiredExamResultsAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => Student)
  @Column(DataTypes.INTEGER)
  student_id: number;

  @ForeignKey(() => Exam)
  @Column(DataTypes.INTEGER)
  exam_id: number;

  @ForeignKey(() => Subject)
  @Column(DataTypes.INTEGER)
  subject_id: number;

  @Column(DataTypes.INTEGER)
  theory_total: number;

  @Column(DataTypes.INTEGER)
  practical_total: number;

  @Column(DataTypes.INTEGER)
  theory_obtain_mark: number;

  @Column(DataTypes.INTEGER)
  practical_obtain_mark: number;

  @Column(DataTypes.INTEGER)
  total_marks: number;

  @Column(DataTypes.INTEGER)
  total_obtain_marks: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // =========== Associations =============

  @BelongsTo(() => Student, { foreignKey: 'student_id', constraints: false })
  student: Student;

  @BelongsTo(() => Exam, { foreignKey: 'exam_id', constraints: false })
  exam: Exam;

  @BelongsTo(() => Subject, { foreignKey: 'subject_id', constraints: false })
  subject: Subject;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(examResult: ExamResults) {
    sanitizeHtmlFieldsAllModules(examResult);
  }
}
