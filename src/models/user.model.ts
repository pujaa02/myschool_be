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
  HasMany
} from 'sequelize-typescript';
import { DataTypes, HasManyCreateAssociationMixin } from 'sequelize';
import { RequiredUserAttributes, USER_STATUS, UserAttributes } from './interfaces/user.model.interface';
import Role from './role.model';
import UserRole from './userRole.model';
import CellMember from './cellMember.model';
import Leave from './leave.model';
import Sensation from './sensation.model';
import SensationComment from './sensationComment.model';
import SensationLike from './sensationLike.model';
import Student from './student.model';
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

  @Column(DataTypes.STRING)
  state: string;

  @Column(DataTypes.STRING)
  country: string;

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

  // =========== Associations =============

  @BelongsTo(() => User, { foreignKey: 'added_by', constraints: false, as: 'added_by_user' })
  added_by_user: User;

  @BelongsToMany(() => Role, {
    through: () => UserRole,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    constraints: false,

  })
  roles: Role[];

  createUser_role: HasManyCreateAssociationMixin<UserRole, 'user_id'>;

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
