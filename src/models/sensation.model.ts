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
import { RequiredSensationAttributes, SensationAttributes } from './interfaces/sensation.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'sensations',
})
export default class Sensation extends Model<SensationAttributes, RequiredSensationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.INTEGER)
  user_id: number;

  @Column(DataTypes.STRING)
  image: string;

  @Column(DataTypes.STRING)
  title: string;

  @Column(DataTypes.STRING)
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
