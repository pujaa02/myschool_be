import { DataTypes } from 'sequelize';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { FeatureAttributes, RequiredFeatureAttributes } from './interfaces/feature.model.interface';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'features',
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
export default class Feature extends Model<FeatureAttributes, RequiredFeatureAttributes> {
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
