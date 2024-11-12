import { verifyPermission } from "../common/helper/permission.helper";
import { BasePermissionGroups, OtherPermissionGroups, PermissionTypes, TagPermissions } from "../common/constants/permissionGroup.constants";
import { generalResponse } from "../common/helper/response/generalResponse";
import { NextFunction, RequestHandler, Request, Response, } from "express";

export function checkPermission(
  module: BasePermissionGroups | OtherPermissionGroups,
  type: PermissionTypes | TagPermissions,
  fromReqParams?: '',
): RequestHandler;
export function checkPermission(
  module: BasePermissionGroups | OtherPermissionGroups,
  type: string,
  fromReqParams: 'body' | 'params' | 'query',
): RequestHandler;
export function checkPermission(
  module: BasePermissionGroups | OtherPermissionGroups,
  type: PermissionTypes | TagPermissions,
  fromReqParams: 'body' | 'params' | 'query' | '',
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hasPermission = await verifyPermission({ req, module, type, fromReqParams });

      return hasPermission
        ? next()
        : generalResponse(res, null, 'You do not have access to this resource.', 'error', true, 403);
    } catch (err) {
      return next(err);
    }
  };
}

export const checkEntityPermission = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req;
      const { module, type } = query;
      if (module && type) {
        const hasPermission = await verifyPermission({
          req,
          module: module as BasePermissionGroups,
          type: type as PermissionTypes,
        });
        return hasPermission
          ? next()
          : generalResponse(res, null, 'You do not have access to this resource.', 'error', true, 403);
      }
      return null;
    } catch (err) {
      return next(err);
    }
  };
};

// *** Super Admin Middleware *** //

// export const isSuperAdmin = () => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { orgOwnerId, id: user_id } = req.tokenData;

//       return orgOwnerId === user_id
//         ? next()
//         : generalResponse(res, null, 'You do not have access to this resource.', 'error', true, 403);
//     } catch (err) {
//       return next(err);
//     }
//   };
// };