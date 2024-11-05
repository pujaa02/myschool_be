// import { FeaturesEnum, PermissionEnum, RoleEnum } from '@/common/constants/enum.constant';
// import { HttpException } from '@/common/helper/response/httpException';
// import { catchAsync, parseData } from '@/common/util';
// import { USER_STATUS } from '@/models/interfaces/user.model.interface';
// import Role from '@/models/role.model';
// import User from '@/models/user.model';
// import { Request, RequestHandler } from 'express';
// import { parse } from 'path';
// import { Op } from 'sequelize';

// interface DynamicFieldOptions {
//   [key: string]: any;
// }
// const checkAccessMiddleware = (feature: FeaturesEnum, permission: PermissionEnum, checkDataId?: string): RequestHandler => {
//   return catchAsync(async (req: Request, res, next) => {
//     const accessQuery: DynamicFieldOptions = {
//       user_id: req?.tokenData?.user?.id,
//       language: req?.language,
//     };
//     let model: any;
//     let checkId: string = '';

//     const courseBundleId =
//       checkDataId == 'bundleId'
//         ? req?.body?.bundle?.id
//         : checkDataId === 'bundle_id'
//           ? req?.query?.bundle_id
//           : checkDataId === 'id'
//             ? req?.body?.id
//             : '';

//     })
// };

// export const checkCreatedBy = async (modelName: any, userId: number, checkId: string) => {
//   const resultData = await modelName.findOne({ where: { created_by: userId, id: checkId } }).then((e) => e?.id);
//   if (resultData) return resultData;
// };

// export default checkAccessMiddleware;
