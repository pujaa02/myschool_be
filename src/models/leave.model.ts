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
import { LeavesAttributes, RequiredLeaveAttributes } from './interfaces/leave.model.interface';
import User from './user.model';
import { sanitizeHtmlFieldsAllModules } from '@/helper/common.helper';

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

  @ForeignKey(() => User)
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

  // =========== Associations =============

  @BelongsTo(() => User, { foreignKey: 'user_id', constraints: false })
  user: User;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(leave: Leave) {
    sanitizeHtmlFieldsAllModules(leave);
  }
}
