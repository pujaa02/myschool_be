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
import { CellMmebersAttributes, RequiredCellMemberAttributes } from './interfaces/cellMember.interface';
import { DataTypes } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'cellMembers',
})
export default class CellMember extends Model<CellMmebersAttributes, RequiredCellMemberAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.STRING)
  name: string;

  @Column(DataTypes.STRING)
  member_image: string;

  @Column(DataTypes.INTEGER)
  committe_id: number;

  @Column(DataTypes.INTEGER)
  user_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
