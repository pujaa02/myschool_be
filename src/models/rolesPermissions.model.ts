import { DataTypes } from 'sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import Permission from './permission.model';
import Role from './role.model';
import { RolesPermissionsAttributes } from './interfaces/rolesPermissions.model.interface';
import Feature from './feature.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'role_permissions',
  indexes: [],
})
export default class RolePermission extends Model<RolesPermissionsAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
  role_permission_key: number;

  @Column(DataTypes.INTEGER)
  role_id: number;

  @Column(DataTypes.INTEGER)
  feature_id: number;

  @Column(DataTypes.INTEGER)
  permission_id: number;

  @BelongsTo(() => Role, { foreignKey: 'role_id', constraints: false, as: 'role' })
  name: Role;

  @Column(DataTypes.STRING)
  access: string;

  @BelongsTo(() => Permission, { foreignKey: 'permission_id', constraints: false, as: 'permission' })
  permission_id_role_permission: Permission;

  @BelongsTo(() => Feature, { foreignKey: 'feature_id', constraints: false, as: 'feature' })
  feature_id_role_permission: Feature;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
