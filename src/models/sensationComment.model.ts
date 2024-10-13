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
import {
  RequiredSensationCommentAttributes,
  SensationCommentsAttributes,
} from './interfaces/sensationComment.model.interface';
import User from './user.model';
import Sensation from './sensation.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'sensation_comments',
})
export default class SensationComment extends Model<SensationCommentsAttributes, RequiredSensationCommentAttributes> {
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

  @Column(DataTypes.STRING)
  comment: string;

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
  static sanitizeHtmlFields(sensationComment: SensationComment) {
    sanitizeHtmlFieldsAllModules(sensationComment);
  }
}
