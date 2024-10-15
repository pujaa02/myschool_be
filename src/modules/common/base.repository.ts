
import { Request } from 'express';
import _ from 'lodash';
import {
    BulkCreateOptions,
    DestroyOptions,
    FindAndCountOptions,
    FindOptions,
    ModelAttributes,
    Optional,
    Sequelize,
    UpdateOptions,
    UpsertOptions,
} from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { TokenDataInterface } from '../auth/interfaces/auth.interfaces';
import db from '@/models';
import { FindOneArgs, FindAllArgs, CreateArgs, CreateOneOptions, CountArgs, BulkCreateArgs, UpdateOneArgs, UpdateOneOptions, DeleteArgs, RestoreArgs, FindAndCountAllArgs } from '@/common/interfaces/general/database.interface';
import { parse } from 'path';

export default class BaseRepository<M extends Model> {
    readonly DBModel: ModelCtor<M>;

    constructor(readonly modelName: string) {
        this.DBModel = <ModelCtor<M>>db.models[modelName];
    }

    readonly get = async (data: Optional<FindOneArgs<M>, 'rejectOnEmpty'>) => {
        return this.DBModel.findOne({ ...data, rejectOnEmpty: false });
    };

    readonly getAll = async (data: FindAllArgs<M>) => {
        return this.DBModel.findAll({ ...data });
    };

    readonly create = async (data: CreateArgs<M>, options?: CreateOneOptions<M>) => {
        return this.DBModel.create(data, options);
    };

    readonly getCount = async (options?: CountArgs<M>) => {
        return this.DBModel.count(options);
    };

    readonly bulkCreate = async (data: BulkCreateArgs<M>, options?: BulkCreateOptions<M>) => {
        return this.DBModel.bulkCreate(data, options);
    };

    readonly update = async (data: UpdateOneArgs<M>, options?: Optional<UpdateOneOptions<M>, 'returning'>) => {
        return this.DBModel.update(data, { returning: true, individualHooks: false, ...options });
    };

    readonly upsert = async (data: CreateArgs<M>, options?: UpsertOptions<M>) => {
        return this.DBModel.upsert(data, { returning: true, ...options });
    };

    readonly deleteData = async (options: DeleteArgs<M>) => {
        return this.DBModel.destroy(options);
    };

    readonly restore = async (options: RestoreArgs<M>) => {
        return this.DBModel.restore(options);
    };

    readonly getAllData = async (options: FindAndCountAllArgs<M>) => {
        return this.DBModel.findAndCountAll({ ...options, distinct: true }).then((parseData: any) => parse(parseData));
    };
}

export const setInstance = <ModelData extends Model & { _isAttribute?: (key: string) => boolean }>(
    data: Record<string, any>,
    model: ModelData,
) => {
    Object.keys(data || {}).forEach((key) => {
        if (!_.isUndefined(data?.[key]) && model?._isAttribute?.(key)) {
            model[key] = data?.[key];
        }
    });
    return model;
};

export const getModel = <M extends Model>(modelName: string, dbI?: Sequelize) => {
    const DB: Sequelize = dbI || require('@/sequelizeDir/models')?.default;
    return <ModelCtor<M>>DB.models[modelName];
};

export interface CustomDestroyOptions<T extends Model = Model> extends DestroyOptions<ModelAttributes<T>> {
    tokenData: TokenDataInterface;
    ignoreValidation?: boolean;
}

export interface CustomUpdateOptions<T extends Model = Model> extends UpdateOptions<ModelAttributes<T>> {
    tokenData: TokenDataInterface;
    ignoreValidation?: boolean;
}

export interface CustomGetOptions<T extends Model = Model> extends FindOptions<ModelAttributes<T>> {
    req: Request;
    tokenData: TokenDataInterface;
    ignoreValidation?: boolean;
}

export interface CustomGetAllCountAllOptions<T extends Model = Model> extends FindAndCountOptions<ModelAttributes<T>> {
    req: Request;
    tokenData: TokenDataInterface;
    ignoreValidation?: boolean;
}
