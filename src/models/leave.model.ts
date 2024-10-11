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
import { LeavesAttributes, RequiredLeaveAttributes } from './interfaces/leave.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'leaves',
})
export default class Leave extends Model<LeavesAttributes, RequiredLeaveAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.INTEGER)
  user_id: number;

  @Column(DataTypes.DATE)
  leave_date: Date;

  @Column(DataTypes.STRING)
  leave_reason: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
