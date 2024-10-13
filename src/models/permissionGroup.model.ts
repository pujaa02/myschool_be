import { DataTypes } from 'sequelize';
import Permission from './permission.model';
import { status } from './interfaces/user.model.interface';
import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { PermissionGroupAttributes } from './interfaces/permissionGroup.model.interface';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'permission_groups',
})
class PermissionGroup extends Model<PermissionGroupAttributes> {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @Column({ allowNull: false, unique: true })
  name: string;

  @Column({ allowNull: false })
  parent_section: string;

  @Column({ allowNull: false })
  child_section: string;

  @Column({ type: DataTypes.ENUM(...Object.values(status)), allowNull: false })
  status: status;

  @HasMany(() => Permission)
  permissions: Permission[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(permissionGroup: PermissionGroup) {
    sanitizeHtmlFieldsAllModules(permissionGroup);
  }
}

export default PermissionGroup;
