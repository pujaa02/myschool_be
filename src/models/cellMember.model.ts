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
import { CellMmebersAttributes, RequiredCellMemberAttributes } from './interfaces/cellMember.model.interface';
import { DataTypes } from 'sequelize';
import Committe from './committe.model';
import User from './user.model';
import { sanitizeHtmlFieldsAllModules } from '@/helper/common.helper';

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

  @ForeignKey(() => Committe)
  @Column(DataTypes.INTEGER)
  committe_id: number;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  user_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // =========== Associations =============

  @BelongsTo(() => User, { foreignKey: 'user_id', constraints: false })
  user: User;

  @BelongsTo(() => Committe, { foreignKey: 'committe_id', constraints: false })
  committe: Committe;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(cellMember: CellMember) {
    sanitizeHtmlFieldsAllModules(cellMember);
  }
}
