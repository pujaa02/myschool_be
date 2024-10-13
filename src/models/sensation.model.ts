import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { RequiredSensationAttributes, SensationAttributes } from './interfaces/sensation.model.interface';
import User from './user.model';
import { sanitizeHtmlFieldsAllModules } from '../helper/common.helper';
import SensationComment from './sensationComment.model';
import SensationLike from './sensationLike.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'sensations',
})
export default class Sensation extends Model<SensationAttributes, RequiredSensationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  user_id: number;

  @Column(DataTypes.STRING)
  image: string;

  @Column(DataTypes.STRING)
  title: string;

  @Column(DataTypes.STRING)
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  // =========== Associations =============

  @BelongsTo(() => User, { foreignKey: 'user_id', constraints: false })
  user: User;

  @HasMany(() => SensationComment, { foreignKey: 'sensation_id', constraints: false })
  sensationComment: SensationComment[];

  @HasMany(() => SensationLike, { foreignKey: 'sensation_id', constraints: false })
  sensationlLike: SensationLike[];

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(sensation: Sensation) {
    sanitizeHtmlFieldsAllModules(sensation);
  }
}
