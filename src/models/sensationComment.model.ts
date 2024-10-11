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
  RequiredSensationCommentAttributes,
  SensationCommentsAttributes,
} from './interfaces/sensationComment.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'sensation_comments',
})
export default class SensationComment extends Model<SensationCommentsAttributes, RequiredSensationCommentAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.INTEGER)
  user_id: number;

  @Column(DataTypes.NUMBER)
  sensation_id: number;

  @Column(DataTypes.STRING)
  comment: string;

  @Column(DataTypes.BOOLEAN)
  isDeleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
