// import { languageModels } from '@/common/constants/enum.constants';
// import { findMostMatchedString } from '@/common/utils';
// import User from '@/sequelizeDir/models/user.model';
// import { Request } from 'express';
// import _ from 'lodash';
// import { caseHandlers } from './builderFunctionSetter.helper';

// export async function builderSetter(model: string, cases: string, req: Request, _user: User) {
//   const { tokenData } = req;
//   await commonCases(req, model);
//   req.query.userId = String(!_.isUndefined(req.query.userId) ? req.query.userId : tokenData?.user?.id);
//   await commonCases(req, model);
//   const selectedHandler = caseHandlers[cases] || caseHandlers.default;
//   await selectedHandler(req);
// }

// const commonCases = async (req: Request, model: string) => {
//   if (!_.isUndefined(req.query.id)) _.set(req.query, 'q[id]', req.query.id);
//   if (!_.isUndefined(req.query.slug)) _.set(req.query, 'q[slug]', `${req.query.slug as string}`);
//   if (!_.isUndefined(req?.query?.getByParentId)) {
//     const matched = findMostMatchedString(model, languageModels);
//     if (matched) {
//       _.set(req.query, 'q[or][0][id]', req?.query?.getByParentId);
//       _.set(req.query, 'q[or][1][parent_table_id][in]', [req?.query?.getByParentId]);
//     }
//   }
//   if (!_.isUndefined(req?.query?.getByParentSlug)) {
//     const matched = findMostMatchedString(model, languageModels);
//     if (matched && model !== 'Code') _.set(req.query, 'q[slug]', req?.query?.getByParentSlug);
//   }
//   if (_.isUndefined(req?.query?.allLanguage) || !req?.query?.allLanguage) {
//     const matched = findMostMatchedString(model, languageModels);
//     if (matched && model !== 'Code') _.set(req.query, 'q[language]', req?.language);
//   }
// };
