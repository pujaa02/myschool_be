import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { RequiredSubjectAttributes, SubjectsAttributes } from './interfaces/subjects.model.interface';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';
import ExamResults from './examResult.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'subjects',
})
export default class Subject extends Model<SubjectsAttributes, RequiredSubjectAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.STRING)
  name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => ExamResults, { foreignKey: 'subject_id', constraints: false })
  examResult: ExamResults[];

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(subject: Subject) {
    sanitizeHtmlFieldsAllModules(subject);
  }
}
