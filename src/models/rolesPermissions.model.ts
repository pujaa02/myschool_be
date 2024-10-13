import { DataTypes } from 'sequelize';
import Permission from './permission.model';
import { status } from './interfaces/user.model.interface';
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Role from './role.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';
import {
  RequiredRolesPermissionsAttributes,
  RolesPermissionsAttributes,
} from './interfaces/rolesPermissions.model.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'role_permissions',
})
class RolePermission extends Model<RolesPermissionsAttributes, RequiredRolesPermissionsAttributes> {
  @ForeignKey(() => Role)
  @Column({ allowNull: false })
  role_id: number;

  @ForeignKey(() => Permission)
  @Column({ allowNull: false })
  permission_id: number;

  @Column({ type: DataTypes.ENUM(...Object.values(status)), defaultValue: status.ACTIVE, allowNull: false })
  status: status;

  @BelongsTo(() => Permission, { foreignKey: 'permission_id' })
  permission: Permission;

  @BelongsTo(() => Role, { foreignKey: 'role_id' })
  role: Role;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(rolePermission: RolePermission) {
    sanitizeHtmlFieldsAllModules(rolePermission);
  }
}

export default RolePermission;
