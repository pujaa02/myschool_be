import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
  Default,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
  Unique,
  ForeignKey,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { RequiredUserAttributes, USER_STATUS, UserAttributes } from './interfaces/user.model.interface';
@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['password', 'secret_2fa', 'reset_pass_token'] } },
  scopes: { withPassword: { attributes: { exclude: [] } } },
  indexes: [{ fields: ['email'], unique: true, where: { deleted_at: null } }],
})
export default class User extends Model<UserAttributes, RequiredUserAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
  email: string;

  @Column(DataTypes.STRING)
  first_name: string;

  @Column(DataTypes.STRING)
  last_name: string;

  @Column(DataTypes.STRING)
  full_name: string;

  @Column(DataTypes.STRING)
  phone: string;

  @Column
  mobile: string;

  @Column(DataTypes.TEXT)
  password: string;

  @Column(DataTypes.STRING)
  timezone: string;

  @Column(DataTypes.DATE)
  birth_date: Date;

  @Column(DataTypes.STRING)
  gender: string;

  @Column(DataTypes.STRING)
  address1: string;

  @Column(DataTypes.STRING)
  address2: string;

  @Column
  city: string;

  @Column(DataTypes.INTEGER)
  state_id: number;

  @Column(DataTypes.INTEGER)
  country_id: number;

  @Column
  zip: string;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  added_by: number;

  @Column(DataTypes.ENUM(...Object.values(USER_STATUS)))
  active: USER_STATUS;

  @Default(false)
  @Column(DataTypes.BOOLEAN)
  verified: boolean;

  @Column
  profile_image: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // readonly toJSON = () => {
  //   const values = Object.assign({}, this.get());
  //   delete values.password;
  //   return values;
  // };
}
