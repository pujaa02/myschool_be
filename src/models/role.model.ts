import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import UserRole from './userRole.model';
import RolePermission from '../models/rolesPermissions.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';
import { RequiredRoleAttributes, RoleAttributes } from './interfaces/role.model.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'roles',
})
class Role extends Model<RoleAttributes, RequiredRoleAttributes> {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @Column({ allowNull: false })
  name: string;

  @Column
  description: string;

  @HasMany(() => UserRole, {
    foreignKey: 'role_id',
    constraints: false,
  })
  user_roles: UserRole[];

  @HasMany(() => RolePermission, {
    foreignKey: 'role_id',
    constraints: false,
  })
  role_permissions: RolePermission[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(role: Role) {
    sanitizeHtmlFieldsAllModules(role);
  }
}

export default Role;
