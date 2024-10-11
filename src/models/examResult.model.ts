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
import { ExamResultAttributes, RequiredExamResultsAttributes } from './interfaces/examResult.interface';

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

  @Column(DataTypes.INTEGER)
  student_id: number;

  @Column(DataTypes.INTEGER)
  exam_id: number;

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
}
