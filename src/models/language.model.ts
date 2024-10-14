import { DataTypes } from 'sequelize';
import { Column, CreatedAt, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { LanguageCreationAttributes, LanguagAttributes } from './interfaces/language.model.interface';

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'languages',
})
export default class LanguageModel extends Model<LanguagAttributes, LanguageCreationAttributes> implements LanguagAttributes {
    @Column(DataTypes.STRING)
    name: string;

    @Column(DataTypes.STRING)
    short_name: string;

    @Column(DataTypes.STRING)
    slug: string;

    @Column(DataTypes.INTEGER)
    created_by: number;

    @Column(DataTypes.INTEGER)
    updated_by: number;

    @Column(DataTypes.BOOLEAN)
    is_default: boolean;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
}
