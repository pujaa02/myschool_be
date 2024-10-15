
import { Request, Response } from 'express';
import RolePermissionRepo from '../repository/rolePermission.repository';
import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';

export default class RolePermissionController {
  private rolePermissionRepository = new RolePermissionRepo();

  /**
   * Add Role Permission Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  public getRolePermissions = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.rolePermissionRepository.getAll({});
    return generalResponse(req, res, responseData, 'GET_ALL_ROLE_PERMISSION', true);
  });
}
