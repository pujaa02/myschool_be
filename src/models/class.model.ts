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
import { ClassesAttributes, RequiredClassAttributes } from './interfaces/class.model.interface';
import { sanitizeHtmlFieldsAllModules } from '@/helper/common.helper';
import Student from './student.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'class',
})
export default class Class extends Model<ClassesAttributes, RequiredClassAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.STRING)
  class_name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => Student, { foreignKey: 'class_id', constraints: false })
  student: Student[];

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(classes: Class) {
    sanitizeHtmlFieldsAllModules(classes);
  }
}
