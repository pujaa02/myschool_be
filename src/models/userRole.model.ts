import { DataTypes } from 'sequelize';
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  DeletedAt,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import Role from '../models/role.model';
import User from '../models/user.model';
import { RequiredUserRoleAttributes, UserRoleAttributes } from './interfaces/userRole.model.interface';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'user_roles',
  indexes: [
    {
      fields: ['user_id', 'role_id'],
      type: 'UNIQUE',
      where: { deleted_at: null },
      using: 'BTREE',
      unique: true,
    },
  ],
})
export default class UserRole extends Model<UserRoleAttributes, RequiredUserRoleAttributes> {
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  role_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  user_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // =========== Associations =============

  @BelongsTo(() => Role, { constraints: false, foreignKey: 'role_id', as: 'role' })
  role: Role;

  @BelongsTo(() => User, { constraints: false, foreignKey: 'user_id', as: 'user' })
  user: User;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(userRole: UserRole) {
    sanitizeHtmlFieldsAllModules(userRole);
  }
}
