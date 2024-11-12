import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import User from '../models/user.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';
import { USER_STATUS } from './interfaces/user.model.interface';
import { RequiredUserOrganizationAttributes, UserOrganizationAttributes } from './interfaces/userOrganization.interface';

@Table({
  paranoid: true,
  timestamps: true,
  tableName: 'user_organizations',
  scopes: {
    defaultOrganization(organization_id: number) {
      return {
        where: {
          organization_id,
        },
      };
    },
  },
  indexes: [
    {
      fields: ['user_id', 'organization_id'],
      type: 'UNIQUE',
      where: { deleted_at: null },
      unique: true,
      using: 'BTREE',
    },
  ],
})
class UserOrganization extends Model<UserOrganizationAttributes, RequiredUserOrganizationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  user_id: number;

  @Column(DataTypes.ENUM(...Object.values(USER_STATUS)))
  user_status: USER_STATUS;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;

  @CreatedAt
  created_at?: string | Date;

  @UpdatedAt
  updated_at?: string | Date;

  @DeletedAt
  deleted_at?: string | Date;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(userOrganization: UserOrganization) {
    sanitizeHtmlFieldsAllModules(userOrganization);
  }
}

export default UserOrganization;
