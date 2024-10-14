import db from "@/models";
import LanguageModel from "@/models/language.model";
import { TokenDataInterface } from "@/modules/auth/interfaces/auth.interfaces";
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Model, ModelCtor } from "sequelize-typescript";
import { generateSlugifyForModel, parse } from "../util";
import slugify from 'slugify';
import { CustomUpdateOptions } from "@/modules/common/base.repository";
import User from "@/models/user.model";
import { translateJson } from "@/middlewares/translation.middleware";

interface IGetModuleDataTranslationArgs {
    data: Object;
    fields: string[];
    slugKeyModule: string;
    slugKeyData?: string;
    module_id?: number;
    transaction: Transaction;
    user_id?: number;
    onlyDefaultLang?: boolean;
    relation_field?: { model_name: string; model_id: number; model_association_key: string }[];
    tokenData?: TokenDataInterface;
    convert?: boolean;
}

export interface ModuleIdLangMapResp {
    moduleIdLangMap: {
        [key: string]: number;
    };
    self: unknown;
    moduleLangMap: any;
}

export interface ModuleResp {
    id: number | unknown;
    language: string;
    parent_table_id: number;
}

export const getModuleChildAndParent = async <M extends Model>(
    modelName: string,
    module_id: number,
    transaction: Transaction,
    include?: Object,
): Promise<ModuleIdLangMapResp> => {
    const moduleIdLangMap = {};
    const moduleLangMap = {};
    const DBModel = <ModelCtor<M>>db.models[modelName];

    const self = (await DBModel.findOne({
        where: {
            id: module_id,
        } as WhereOptions<{ id: number }>,
        include,
        ...(transaction ? { transaction } : {}),
    })) as unknown as ModuleResp;

    moduleIdLangMap[self?.language] = self?.id;
    moduleLangMap[self?.language] = self;

    let parentRecords: ModuleResp;

    if (self?.parent_table_id) {
        parentRecords = (await DBModel.findOne({
            where: {
                id: self?.parent_table_id,
            } as WhereOptions<{ id: number }>,
            ...(transaction ? { transaction } : {}),
            include,
        })) as unknown as ModuleResp;
        if (parentRecords) {
            moduleIdLangMap[parentRecords?.language] = parentRecords?.id;
            moduleLangMap[parentRecords?.language] = parentRecords;
        }
    }

    const childRecords = (await DBModel.findAll({
        where: {
            parent_table_id: self?.parent_table_id || self?.id,
            id: {
                [Op.ne]: self?.id,
            },
        } as WhereOptions<{ id: unknown; parent_table_id: number }>,
        ...(transaction ? { transaction } : {}),
        include,
    })) as unknown as ModuleResp[];

    childRecords.forEach((childRecord) => {
        moduleIdLangMap[childRecord.language] = childRecord.id;
        moduleLangMap[childRecord.language] = childRecord;
    });
    return {
        moduleIdLangMap,
        self,
        moduleLangMap,
    };
};

export const getModuleDataTranslation = async <M extends Model>(
    modelName: string,
    translationArgs: IGetModuleDataTranslationArgs,
) => {
    const {
        data,
        fields,
        slugKeyModule,
        slugKeyData,
        module_id,
        transaction,
        user_id,
        onlyDefaultLang,
        relation_field,
        tokenData,
        convert = true,
    } = translationArgs;

    const languages = await LanguageModel.findAll({
        where: {
            ...(onlyDefaultLang ? { is_default: true } : {}),
        },
        order: [['is_default', 'DESC']],
        ...(transaction ? { transaction } : {}),
    });

    let defautLang: string;
    let parentChildData: ModuleIdLangMapResp;

    if (module_id) {
        parentChildData = await getModuleChildAndParent(modelName, module_id, transaction);
    }

    let userParentChildData: ModuleIdLangMapResp;
    if (user_id) {
        userParentChildData = await getModuleChildAndParent(User.name, user_id, transaction);
    }

    const relationKeyLangIdMap: { [key: string]: ModuleIdLangMapResp } = {};

    if (relation_field && relation_field.length) {
        await Promise.all(
            relation_field.map(async (relation) => {
                const moduleIdLangMap = await getModuleChildAndParent(relation.model_name, relation.model_id, transaction);
                relationKeyLangIdMap[relation.model_association_key] = moduleIdLangMap;
            }),
        );
    }

    const labelDataToReturn = await Promise.all(
        languages.map(async (lang) => {
            if (lang.is_default) defautLang = lang.name;
            let translatedData = data;
            if (convert) translatedData = await translateJson({ ...data }, lang.name, [...fields]);

            const relation_fields = {};

            for (const key in relationKeyLangIdMap) {
                relation_fields[key] =
                    relationKeyLangIdMap[key].moduleIdLangMap[lang.name] || Object.values(relationKeyLangIdMap[key].moduleIdLangMap)[0];
            }
            return {
                ...translatedData,
                language: lang.name,
                ...(module_id
                    ? { id: parentChildData.moduleIdLangMap[lang.name] || Object.values(parentChildData.moduleIdLangMap)[0] }
                    : {}),
                ...relation_fields,
            };
        }),
    );

    let parent_table_id = null;

    const model = <ModelCtor<M>>db.models[modelName];

    let slug: string;

    if (slugKeyData) {
        const slugifyData = slugify(data[slugKeyData]);
        if (slugifyData !== parentChildData?.self?.[slugKeyModule]) {
            slug = await generateSlugifyForModel(data[slugKeyData], model, slugKeyModule);
        }
    }

    const moduleIdLangMap: { [key: string]: number } = {};

    if (!module_id) {
        for (const i in labelDataToReturn) {
            const langData = labelDataToReturn[i];

            const moduleData = await model.create(
                {
                    ...langData,
                    ...(slug ? { [slugKeyModule]: slug } : {}),
                    parent_table_id,
                    ...(user_id
                        ? {
                            created_by: userParentChildData.moduleIdLangMap[langData.language] || user_id,
                            updated_by: userParentChildData.moduleIdLangMap[langData.language] || user_id,
                        }
                        : {}),
                } as any,
                { transaction },
            );

            moduleIdLangMap[langData.language] = moduleData.id;
            if (langData.language === defautLang) parent_table_id = parse(moduleData).id;
        }
    } else {
        const updateValue = await Promise.all(
            labelDataToReturn.map((langData) => {
                moduleIdLangMap[langData.language] = langData.id;

                return model.update(
                    {
                        ...langData,
                        ...(user_id
                            ? {
                                created_by: userParentChildData.moduleIdLangMap[langData.language] || user_id,
                                updated_by: userParentChildData.moduleIdLangMap[langData.language] || user_id,
                            }
                            : {}),
                        ...(slug ? { [slugKeyModule]: slug } : {}),
                    },
                    { where: { id: langData.id }, transaction, tokenData, individualHooks: true } as CustomUpdateOptions,
                );
            }),
        );
    }

    return { moduleIdLangMap, slug };
};