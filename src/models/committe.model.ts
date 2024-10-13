import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { CommitteeAttributes, RequiredComiiteeAttributes } from './interfaces/committe.model.interface';
import { sanitizeHtmlFieldsAllModules } from '@/helper/common.helper';
import CellMember from './cellMember.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'committe',
})
export default class Committe extends Model<CommitteeAttributes, RequiredComiiteeAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull
  @Column(DataTypes.INTEGER)
  id: number;

  @Column(DataTypes.STRING)
  name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => CellMember, { foreignKey: 'committe_id', constraints: false })
  cellMember: CellMember[];

  @BeforeCreate
  @BeforeUpdate
  static sanitizeHtmlFields(committe: Committe) {
    sanitizeHtmlFieldsAllModules(committe);
  }
}
