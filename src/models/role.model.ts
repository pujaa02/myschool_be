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
import { RequiredRoleAttributes, RoleAttributes } from './interfaces/role.model.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'roles',
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
export default class Role extends Model<RoleAttributes, RequiredRoleAttributes> {
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
