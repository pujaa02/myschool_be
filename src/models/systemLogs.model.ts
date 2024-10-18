import { LanguageEnum } from '@/common/interfaces/general/general.interface';
import { DataTypes } from 'sequelize';
import { BelongsTo, Column, CreatedAt, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Feature from './feature.model';
import User from './user.model';
import { RequiredSystemLogAttribute, SystemLogAttributes } from './interfaces/systemLogs.model.interface';
import { PermissionEnum } from '@/common/constants/enum.constant';

@Table({
  tableName: 'system_logs',
})
export default class SystemLogs
  extends Model<SystemLogAttributes, RequiredSystemLogAttribute>
  implements SystemLogAttributes
{
  @Column({
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  title: string;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  slug: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT('long'),
  })
  description: string;

  @Column({
    defaultValue: LanguageEnum.English,
    type: DataTypes.ENUM(...Object.values(LanguageEnum)),
  })
  language: LanguageEnum;

  @Column({
    allowNull: true,
    type: DataTypes.BOOLEAN,
  })
  is_language_considered: boolean;

  @Column({
    defaultValue: PermissionEnum.View,
    type: DataTypes.ENUM(...Object.values(PermissionEnum)),
  })
  permission_type: PermissionEnum;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  module_id: number;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  feature_id: number;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  user_id: number;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  created_by: number;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  updated_by: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Feature, {
    foreignKey: 'feature_id',
    constraints: false,
    as: 'feature',
  })
  feature: Feature;

  @BelongsTo(() => Feature, {
    foreignKey: 'user_id',
    constraints: false,
    as: 'users',
  })
  users: User;
}
