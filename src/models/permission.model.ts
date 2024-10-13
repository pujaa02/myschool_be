import { DataTypes } from 'sequelize';
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { status } from './interfaces/user.model.interface';
import RolePermission from '../models/rolesPermissions.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';
import { PermissionAttributes } from './interfaces/permission.mode.interface';
import PermissionGroup from './permissionGroup.model';

@Table({
  timestamps: true,
  tableName: 'permissions',
  indexes: [
    {
      fields: ['permission_group_id', 'name'],
      unique: true,
      type: 'UNIQUE',
      using: 'BTREE',
    },
  ],
})
class Permission extends Model<PermissionAttributes> {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @Column({ allowNull: false })
  @ForeignKey(() => PermissionGroup)
  permission_group_id: number;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  order: number;

  @Column({ allowNull: false })
  is_disabled: boolean;

  @Column({ type: DataTypes.ENUM(...Object.values(status)), allowNull: false })
  status: status;

  @BelongsTo(() => PermissionGroup, {
    foreignKey: 'permission_group_id',
  })
  permission_group: PermissionGroup;

  @HasMany(() => RolePermission, {
    foreignKey: 'permission_id',
    constraints: false,
  })
  role_permissions: RolePermission[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(permission: Permission) {
    sanitizeHtmlFieldsAllModules(permission);
  }
}

export default Permission;
