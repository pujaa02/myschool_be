// import { RoleEnum, queryBuildCases } from '@/common/constants/enum.constants';
// import Feature from '@/sequelizeDir/models/feature.model';
// import LanguageModel from '@/sequelizeDir/models/language.model';
// import Role from '@/sequelizeDir/models/role.model';
// import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
// import User from '@/sequelizeDir/models/user.model';
// import { LanguageEnum, paginationParams } from '@common/interfaces/general/general.interface';
// import { parse } from '@common/utils';
// import { Request } from 'express';
// import _ from 'lodash';
// import { Transaction } from 'sequelize';
// import { paginatedResults } from './pagination.helper';

// export const dropdownHandler = async (cases: string, req: Request, data: any) => {
//   const getDefaultLang = await LanguageModel.findOne({ where: { is_default: true } }).then((l) => parse(l).name);
//   const foundDropdownData = data?.rows?.map((e: { [x: string]: any; language: LanguageEnum; id: any }) => {
//     let value = null;

//     const queryValue = !_.isUndefined(req.query.value) ? req.query.value : 'id';
//     const idValue = queryValue === 'id' ? true : false;
//     if (!_.isUndefined(req.query.dropdownParent) && idValue) {
//       if (req.language != getDefaultLang) {
//         value = e['parent_table_id'] ? e['parent_table_id'] : e['id'];
//       } else {
//         value = e['id'];
//       }
//     } else {
//       value = e[`${req.query.value as string}`] ? e[`${req.query.value as string}`] : e.id;
//     }

//     return {
//       ...(req?.query?.sub_category_id && cases === queryBuildCases.getSurveyForm
//         ? !_.isEmpty(e.courseSubcategorySurvey)
//           ? { isMatch: true }
//           : { isMatch: false }
//         : {}),
//       ...(req?.query?.project_id ? { is_default: e?.cardCompany[0]?.is_default || false } : {}),
//       label: e[`${req.query.label as string}`],
//       value,
//     };
//   });
//   return foundDropdownData;
// };

// const casesToIgnore = [
//   'getUserSocialAccounts',
//   'getAttendanceSheet',
//   'getAllCourseOfTrainer',
//   queryBuildCases.getEnrolledCompany,
//   queryBuildCases.getAllSubCourseCategory,
//   queryBuildCases.getAllCertificateTemplate,
//   queryBuildCases.getCourseDetails,
// ];
// const casesToIgnoreForCourseSlug = [
//   'getUserSocialAccounts',
//   queryBuildCases.getExamResult,
//   queryBuildCases.getExamResultForAllParticipate,
//   'getAttendanceSheet',
//   'getAllCourseOfTrainer',

//   queryBuildCases.getAllFilteredTrainers,
//   queryBuildCases.getAllCourseQuotes,
//   queryBuildCases.getSelectedTrainer,
//   queryBuildCases.getAllCoursePrivateCompanies,
//   queryBuildCases.getAllCourseParticipates,
//   queryBuildCases.getAllCompanyOfCourse,
//   queryBuildCases.getEnrolledCompany,
//   queryBuildCases.getAttendeesResult,
//   queryBuildCases.getAllSubCourseCategory,
//   queryBuildCases.getMisMatchRecords,
//   queryBuildCases.getAllAccessPermission,
//   queryBuildCases.getAllPaymentTerms,
//   queryBuildCases.getAllOrder,
//   queryBuildCases.getAllOrderComments,
//   queryBuildCases.getAllOrderAttachments,
//   queryBuildCases.getAllInvoice,
//   queryBuildCases.getAvailableRooms,
//   queryBuildCases.getAvailableResources,
//   queryBuildCases.getAllCreditNotes,
//   queryBuildCases.getAllTrainerAllInvoice,
//   queryBuildCases.getAllTrainer,
//   queryBuildCases.getAllTrainerInvoice,
//   queryBuildCases.getAllExpense,
//   queryBuildCases.getAllSupplier,
//   queryBuildCases.getAllSupplierName,
//   queryBuildCases.getAllSurveyResult,
// ];

// export const idObjectReturner = (req: Request, p: paginationParams, pageData: any[]) => {
//   return pageData[0];
// };

// export const viewHandler = async (req: Request, rawData: any) => {
//   return { data: parse(rawData) };
// };

// export const paginatedData = async (req: Request, p: paginationParams, moduleData: any) => {
//   let pageData = paginatedResults(p.page, p.limit, moduleData);
//   pageData = parse(pageData);
//   const returnObj = {
//     data: pageData,
//     count: p.limit ? moduleData.length : undefined,
//     currentPage: p.page ? p.page : undefined,
//     limit: p.limit ? p.limit : undefined,
//     lastPage: p.page && p.limit ? Math.ceil(moduleData.length / +p.limit) : undefined,
//   };
//   return returnObj;
// };

// export const getDetails = async (
//   req: Request,
//   moduleData: any,
//   { paramsData: p }: { paramsData: paginationParams },
//   cases: string,
// ): Promise<{ data: any; count?: number; limit?: number; lastPage?: number | object } | any> => {
//   if (!_.isNull(p.id) && !casesToIgnore.includes(cases)) return await idObjectReturner(req, p, moduleData);
//   if (req?.query?.latest) return [moduleData[0]];
//   if (!_.isNull(p.slug) && !casesToIgnore.includes(cases)) return await idObjectReturner(req, p, moduleData);
//   if (!_.isUndefined(req?.params?.username) && !casesToIgnore.includes(cases)) return await idObjectReturner(req, p, moduleData);
//   if (!_.isUndefined(req?.query?.course_slug) && !casesToIgnoreForCourseSlug.includes(cases))
//     return await idObjectReturner(req, p, moduleData);
//   if (!_.isUndefined(req.query.view)) return await viewHandler(req, moduleData);
//   else return await paginatedData(req, p, moduleData);
// };

// export const relationalGroupHandler = (req: Request, data: any) => {
//   const field = req.query.relationalGroup;
//   const groupedData =
//     data.count > 0 &&
//     data.rows.reduce(
//       (acc, curr) => {
//         if (curr[field as string].length) {
//           acc.contains.push(curr);
//         } else {
//           acc.exclude.push(curr);
//         }
//         return acc;
//       },
//       { contains: [], exclude: [] },
//     );
//   return groupedData;
// };

// export function logMessageSetter(message, dynamicData) {
//   Object.keys(dynamicData).forEach((key) => {
//     const placeholder = `{{${key}}}`;
//     message = message.replace(new RegExp(placeholder, 'g'), dynamicData[key]);
//   });
//   return message;
// }

// export const createLogMessage = async (
//   req: any,
//   messageSet: string,
//   featureName: string,
//   titleName: string,
//   moduleId: any,
//   repository: any,
//   additionalProps?: {
//     additionalMessageProps?: object;
//     languageData?: { language_considered?: boolean; language?: string };
//     transaction?: Transaction;
//   },
//   permissionType?: string,
// ) => {
//   const user = await User.findOne({
//     where: { active: USER_STATUS.ACTIVE },
//     attributes: ['id'],
//     include: [
//       {
//         model: Role,
//         where: { name: RoleEnum.Admin },
//         required: true,
//       },
//     ],
//   });
//   const description = logMessageSetter(messageSet, {
//     username: req !== null ? req?.tokenData?.user?.full_name : user?.full_name ? user?.full_name : '',
//     ...(additionalProps && additionalProps?.additionalMessageProps),
//   });
//   const feature = await Feature.findOne({ where: { name: featureName }, attributes: ['id'] });
//   const logPayload = {
//     title: titleName,
//     description: description,
//     module_id: moduleId,
//     feature_id: feature.id,
//     user_id: req?.tokenData ? req?.tokenData?.user?.id : user?.id ? user?.id : 1,
//     is_language_considered: additionalProps?.languageData?.language_considered || false,
//     language: additionalProps?.languageData?.language || LanguageEnum.italian,
//     permission_type: permissionType,
//   };
//   await repository.createLog(logPayload, req, additionalProps?.transaction);
// };
