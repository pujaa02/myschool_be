import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constants';
import { HttpException } from '@/common/helpers/response/httpException';
import { catchAsync } from '@/common/utils';
import RolePermissionRepo from '@/modules/rolePermission/repository/rolePermission.repository';
import { Request, RequestHandler } from 'express';
import _ from 'lodash';

const checkRoleMiddleware = (feature: FeaturesEnum, permission: PermissionEnum): RequestHandler => {
  return catchAsync(async (req: Request, res, next) => {
    const data = checkIfItsRole(req);
    if (data) return next();
    checkRoleParams(feature, req);
    const rolePermissionRepo = new RolePermissionRepo();
    const result = await rolePermissionRepo.validateRolePermission(req.tokenData?.user?.role_id, feature, permission, req, next);
    if (result) {
      // delete req.body?.role;
      next();
    } else {
      throw new HttpException(400, 'MODULE_ACCESS_DENIED');
    }
  });
};

export const checkRoleMiddlewareData = async (req, next, feature: FeaturesEnum, permission: PermissionEnum) => {
  const rolePermissionRepo = new RolePermissionRepo();
  const result = await rolePermissionRepo.validateRolePermission(req.tokenData?.user?.role_id, feature, permission, req, next);
  if (result) return true;
  else return false;
};

export const checkRoleParams = (feature: FeaturesEnum, req: Request) => {
  if (feature === FeaturesEnum.User) {
    const condition1 = ['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase()) && _.isUndefined(req?.body?.role);
    const condition2 = ['GET', 'DELETE'].includes(req.method.toUpperCase()) && _.isUndefined(req?.query?.role);
    if (condition1 || condition2) throw new HttpException(400, 'ROLE_NOT_FOUND', { error: 'role params not found' });
  }
};

export const checkIfItsRole = (req: Request) => {
  const condition1 = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase()) && !_.isUndefined(req?.body?.profile);
  const condition2 = ['GET'].includes(req.method.toUpperCase()) && !_.isUndefined(req?.query?.profile);

  delete req.body?.profile;

  return condition1 || condition2;
};

export default checkRoleMiddleware;
