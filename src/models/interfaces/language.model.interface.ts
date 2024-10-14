import { Optional } from 'sequelize';

type LanguagAttributes = {
    id?: number;
    name?: string;
    short_name?: string;
    slug?: string;
    created_by?: number;
    updated_by?: number;
    is_default?: boolean;
    updated_at?: Date;
    created_at?: Date;
    deleted_at?: Date;
};

type LanguageCreationAttributes = Optional<LanguagAttributes, 'id'>;

export { LanguagAttributes, LanguageCreationAttributes };
