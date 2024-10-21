import { HttpException } from '../../../../common/helper/response/httpException';
import { logger } from '../../../../common/util/logger';
import User from '../../../../models/user.model';
import BaseRepository from '../../../../modules/common/base.repository';
import { Request } from 'express';
import _ from 'lodash';
import { parse } from 'path';
import { Op, Transaction } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { getPaginationParams } from './pagination.helper';
import { additionalQueries } from './additionalQueries.helper';
import { attributeSetter } from './attributeSetter.helper';
import { builderSetter } from './builderSetter.helper';
import { filterData } from './caseWiseDataFilter.helper';
import { relationalGroupHandler, dropdownHandler, getDetails } from './databaseCommon.helper';
import { groupSetter } from './groupSetter.helper';
import { includeDataSetter } from './includeSetter.helper';
import { orderSetter } from './orderSetter.helper';
import { queryBuilderSetter } from './queryBuilderSetter.helper';
import { conditionSetter } from './whereSetter.helper';
import { QueryParser } from '../queryParser';

export const getAllData = async (req: Request, modelName: string, where: any, queryBuild: any) => {
  try {
    const model = new BaseRepository(modelName);
    const data = await model.getAllData({
      where: queryBuild.where ? { ...queryBuild.where, ...where } : { ...where },
      order: queryBuild.order,
      ...(queryBuild.group ? { group: queryBuild.group } : {}),
      attributes: queryBuild.attributes,
      ...(!_.isEmpty(queryBuild.include) ? { include: queryBuild.include } : {}),
      ...(req?.transaction ? { transaction: req?.transaction } : {}),
    });

    return data;
  } catch (error) {
    logger.log('warn', 'Error In Get Data :');
  }
};

export const getData = async (req: Request, modelName: string, where: any, queryBuild: any) => {
  try {
    const model = new BaseRepository(modelName);
    const data = await model.get({
      where: queryBuild.where ? { ...queryBuild.where, ...where } : { ...where },
      order: queryBuild.order,
      attributes: queryBuild.attributes,
      ...(!_.isEmpty(queryBuild.include) ? { include: queryBuild.include } : {}),
      ...(req?.transaction ? { transaction: req?.transaction } : {}),
    });
    return data;
  } catch (error) {
    logger.log('warn', 'Error In Get Data :');
  }
};

export const getAllDetails = async (
  model: any,
  modelName: string,
  cases: string,
  req: Request,
  isCheckDeleted = true,
  ignorePagination = false,
) => {
  const { query, tokenData } = req;
  req.query.cases = cases;
  const paramsData = getPaginationParams(req);
  await builderSetter(modelName, cases, req, (tokenData?.user as User) || null);
  let queryBuild = new QueryParser({ request: req, model }).getFullQuery();
  const where: any = await conditionSetter(req, modelName, cases);
  await groupSetter(req, modelName, cases, queryBuild);
  await orderSetter(req, modelName, cases, queryBuild);

  await attributeSetter(req, modelName, cases, queryBuild);
  await includeDataSetter(req, queryBuild, cases);

  if (ignorePagination) {
    delete queryBuild.limit;
    delete queryBuild.offset;
  }
  queryBuild = queryBuilderSetter(req, queryBuild, cases);

  let foundData: any = await getAllData(
    req,
    modelName,
    { ...queryBuild.where, ...where, ...(isCheckDeleted ? { deleted_at: null } : {}) },
    queryBuild,
  );
  foundData = await additionalQueries(req, foundData, cases);

  if (ignorePagination) {
    return foundData;
  }

  if (query?.relationalGroup) {
    return await relationalGroupHandler(req, foundData);
  }

  if (foundData && foundData.count > 0) {
    const dataToReturn = await filterData(req, foundData?.rows, cases);
    foundData = { rows: dataToReturn, count: dataToReturn.length };
  }

  if (query?.dropdown) return await dropdownHandler(cases, req, foundData);
  else {
    const returnObj = await getDetails(
      req,
      foundData?.rows || [],
      {
        paramsData,
      },
      cases,
    );
    return returnObj;
  }
};
export const getDetail = async (model: any, modelName: string, cases: string, req: Request, isCheckDeleted = true) => {
  const { tokenData } = req;

  await builderSetter(modelName, cases, req, tokenData.user as User);
  const queryBuild = new QueryParser({ request: req, model }).getFullQuery();
  const where: any = await conditionSetter(req, modelName, cases);

  await groupSetter(req, modelName, cases, queryBuild);
  await orderSetter(req, modelName, cases, queryBuild);

  await attributeSetter(req, modelName, cases, queryBuild);
  await includeDataSetter(req, queryBuild, cases);

  let foundData = await getData(
    req,
    modelName,
    { ...queryBuild.where, ...where, ...(isCheckDeleted ? { deleted_at: null } : {}) },
    queryBuild,
  );

  if (foundData) {
    const data = await additionalQueries(req, foundData, cases);
    const dataToReturn = await filterData(req, data, cases);
    foundData = dataToReturn;
  }
  return foundData;
};

export const modelExist = async (modelName: string, data: any, where = {}) => {
  const model = new BaseRepository(modelName);
  let resultData: any = await model.get({
    where: {
      ...(data?.id ? { id: data.id } : data?.slug ? { slug: data.slug } : {}),
      ...(where ? where : {}),
    },
  });
  resultData = parse(resultData);
  if (resultData) return resultData;
  else throw new HttpException(400, 'NOT_FOUND');
};
export const modelExistOrNot = async (modelName: string, data: any, where = {}) => {
  const model = new BaseRepository(modelName);
  let resultData: any = await model.get({
    where: {
      ...(data?.id ? { id: data.id } : data?.slug ? { slug: data.slug } : {}),
      ...(where ? where : {}),
    },
  });
  resultData = parse(resultData);
  return resultData;
};

export const getAssociatedModel = <N extends Model>(key: string, model: ModelCtor<N>) => {
  const db = require('@sequelizeDir/models')?.default;
  const modelName = model?.associations?.[key]?.target?.name;
  if (modelName) {
    return db.models?.[modelName];
  }
  return null;
};

export const deleteModelData = async (
  modelData: any,
  modelName: string,
  data: any,
  course_id?: number,
  transaction?: Transaction,
  modelsToDelete = [],
) => {
  const model = new BaseRepository(modelName);
  if (data) {
    const ids = data.map((e) => e?.id);

    const allData: any = await model.getAll({ where: { id: ids } });
    // get all slugs
    const slugs = allData.map((e) => e.slug);

    await Promise.all(
      modelsToDelete.map(async (m) => {
        // check model is associated with main model
        const isModelAssociated = await getAssociatedModel(m, modelData);
        //yes
        if (_.isNull(isModelAssociated)) {
          try {
          } catch (error) {}
          // destroy its data
          // await m.deleteData({
          //   where: {
          //     slug: {
          //       [Op.notIn]: slugs,
          //     },
          //     ...(course_id ? { course_id } : {}),
          //   },
          //   ...(transaction ? { transaction } : {}),
          // });
        }
      }),
    );

    const result = await model.deleteData({
      where: {
        slug: {
          [Op.notIn]: slugs,
        },
        ...(course_id ? { course_id } : {}),
      },
      ...(transaction ? { transaction } : {}),
    });

    return result;
  }
};

// export const modelIdByLanguage = async (req: Request, model: any, data: any) => {
//   const matched = findMostMatchedString(model.name, languageModels);
//   if (matched) {
//     const slug = await model.get({ where: { id: data.id } });
//     const resultData = await model.get({ where: { slug, language: req.language } });
//     return resultData.id;
//   }
// };

export const findOrCreateData = async (modelName: string, condition: any, data: any, transaction?: any) => {
  const model = new BaseRepository(modelName);
  const resultData = await model.get({ where: condition });
  if (resultData) return resultData;
  else return await model.create(data, { ...(transaction ? { transaction } : {}) });
};

export const createOrUpdateData = async (modelName: string, condition: any, data: any, transaction?: any) => {
  const model = new BaseRepository(modelName);
  const resultData = await model.get({ where: condition });
  if (resultData) return await model.update(data, { where: condition, ...(transaction ? { transaction } : {}) });
  else return await model.create(data, { ...(transaction ? { transaction } : {}) });
};
