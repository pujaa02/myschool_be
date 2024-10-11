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
import { RequiredStudentAttributes, StudentsAttributes } from './interfaces/students.interface';

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

  @Column(DataTypes.INTEGER)
  user_id: number;

  @Column(DataTypes.NUMBER)
  class_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
