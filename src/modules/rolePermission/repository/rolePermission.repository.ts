import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';
import { HttpException } from '@/common/helper/response/httpException';
import { checkRoleMiddlewareData } from '@/middlewares/checkRole.middleware';
import Feature from '@/models/feature.model';
import Permission from '@/models/permission.model';
import Role from '@/models/role.model';
import RolePermission from '@/models/rolesPermissions.model';
import BaseRepository from '@/modules/common/base.repository';

import { NextFunction, Request } from 'express';
import _ from 'lodash';
import { parse } from 'path';
export default class RolePermissionRepo extends BaseRepository<RolePermission> {
  constructor() {
    super(RolePermission.name);
  }

  readonly validateRolePermission = async (
    roleId: number,
    featureName: FeaturesEnum,
    permissionName: PermissionEnum,
    req: Request,
    next: NextFunction,
  ) => {
    const response = await this.get({
      include: [
        { model: Feature, where: { name: featureName } },
        { model: Permission, where: { name: permissionName } },
      ],
      // where: { role_id: roleId },
    });
    if (response) {
      if (featureName === FeaturesEnum.User) {
        let role_ids: any;
        if (!_.isNull(response.access) && !_.isUndefined(response.access)) {
          role_ids = assignRoleParams(req);
          if (role_ids) {
            const user_access = response.access;
            const user_array = user_access.includes(',') ? Array.from(user_access.split(',')) : [user_access];
            const separated_roles = role_ids.includes(',') ? Array.from(role_ids.split(',')) : [role_ids];
            const exist_access: number[] = separated_roles.map((strNumber) => Number(strNumber));
            const access_role_ids = await Promise.all(
              user_array.map(async (name) => {
                const temp = await Role.findAll({
                  where: {
                    name,
                  },
                  attributes: ['id'],
                });
                return parse(temp)[0].id;
              }),
            );
            const isAccess = exist_access.some((element) => access_role_ids.includes(element));
            const findRole = exist_access.filter((element) => access_role_ids.includes(element));
            if (isAccess) {
              for (const roleData of findRole) {
                const temp = await Role.findOne({
                  where: {
                    id: roleData,
                  },
                  attributes: ['id', 'name'],
                });
                const d = await checkRoleMiddlewareData(
                  req,
                  next,
                  temp.name as unknown as FeaturesEnum,
                  permissionName as PermissionEnum,
                );
                return d;
              }
            }
          } else throw new HttpException(400, 'MODULE_ACCESS_DENIED');
        }
      } else return true;
    } else {
      return false;
    }
  };
}

export const assignRoleParams = (req: Request) => {
  let role_ids: any;
  if (!_.isUndefined(req.query.role)) role_ids = String(req.query.role);
  else if (!_.isUndefined(req.body.role)) role_ids = String(req.body.role);
  return role_ids;
};
