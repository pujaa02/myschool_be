import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { PermissionAttributes, RequiredPermissionAttributes } from './interfaces/permission.mode.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'permissions',
  indexes: [
    {
      fields: ['name'],
      unique: true,
      where: {
        deleted_at: null,
      },
    },
  ],
})
export default class Permission extends Model<PermissionAttributes, RequiredPermissionAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
