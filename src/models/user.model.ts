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
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { DATE_FORMAT, RequiredUserAttributes, USER_STATUS, UserAttributes } from './interfaces/user.model.interface';
import Role from './role.model';
import CellMember from './cellMember.model';
import Leave from './leave.model';
import Sensation from './sensation.model';
import SensationComment from './sensationComment.model';
import SensationLike from './sensationLike.model';
import Student from './student.model';
// import { LanguageEnum } from '../common/interfaces/general/general.interface';
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

  // @Column(DataTypes.STRING)
  // secret_2fa: string;

  // @Column(DataTypes.BOOLEAN)
  // two_factor_enabled: boolean;

  @Column(DataTypes.VIRTUAL)
  get full_name() {
    return `${this.getDataValue('first_name') || ''} ${this.getDataValue('last_name') || ''}`.trim();
  }

  @AllowNull(false)
  @Column(DataTypes.STRING)
  username: string;

  @Column(DataTypes.STRING)
  contact: string;

  @Column
  profile_image: string;

  @Column(DataTypes.TEXT)
  password: string;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  added_by: number;

  @Default(DATE_FORMAT)
  @Column(DataTypes.STRING)
  date_format: string;

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

  @Column
  country: string;

  @Column
  state: string;

  @Column
  zip: string;

  @Default(USER_STATUS.ACTIVE)
  @Column(DataTypes.ENUM(...Object.values(USER_STATUS)))
  active: USER_STATUS;

  @Column
  last_login_time: Date;

  @Default(false)
  @Column(DataTypes.BOOLEAN)
  verified: boolean;

  @ForeignKey(() => Role)
  @Column
  role_id: number;

  // @Default(false)
  // @Column(DataTypes.BOOLEAN)
  // is_head: boolean;

  // @Column({
  //   defaultValue: LanguageEnum.English,
  //   type: DataTypes.ENUM(...Object.values(LanguageEnum)),
  // })
  // language: LanguageEnum;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @Column
  pass_logs: string;

  // @Column
  // parent_table_id: number;

  // @Column
  // last_active_time: Date | null;

  // =========== Associations =============

  @BelongsTo(() => User, { foreignKey: 'added_by', constraints: false, as: 'added_by_user' })
  added_by_user: User;

  @BelongsTo(() => Role, { foreignKey: 'role_id', constraints: false, as: 'role' })
  role: Role;

  @HasMany(() => CellMember, { foreignKey: 'user_id', constraints: false })
  cellMember: CellMember[];

  @HasMany(() => Leave, { foreignKey: 'user_id', constraints: false })
  leave: Leave[];

  @HasMany(() => Sensation, { foreignKey: 'user_id', constraints: false })
  sensation: Sensation[];

  @HasMany(() => SensationComment, { foreignKey: 'user_id', constraints: false })
  sensationComment: SensationComment[];

  @HasMany(() => SensationLike, { foreignKey: 'user_id', constraints: false })
  sensationlLike: SensationLike[];

  @HasMany(() => Student, { foreignKey: 'user_id', constraints: false })
  student: Student[];
}
