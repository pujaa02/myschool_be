import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { RequiredSensationLikeAttributes, SensationLikesAttributes } from './interfaces/sensationLike.model.interface';
import User from './user.model';
import Sensation from './sensation.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'sensation_likes',
})
export default class SensationLike extends Model<SensationLikesAttributes, RequiredSensationLikeAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  user_id: number;

  @ForeignKey(() => Sensation)
  @Column(DataTypes.INTEGER)
  sensation_id: number;

  @Default(false)
  @Column(DataTypes.BOOLEAN)
  isDeleted: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // =========== Associations =============

  @BelongsTo(() => User, { foreignKey: 'user_id', constraints: false })
  user: User;

  @BelongsTo(() => Sensation, { foreignKey: 'sensation_id', constraints: false })
  sensation: Sensation;

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(sensationLike: SensationLike) {
    sanitizeHtmlFieldsAllModules(sensationLike);
  }
}
