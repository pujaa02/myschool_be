import { catchAsync } from '@/common/utils';
import { generalResponse } from '@helpers/response/generalResponse';
import PermissionRepo from '@modules/permission/repository/permission.repository';
import { Request, Response } from 'express';

export default class PermissionController {
  private permissionRepository = new PermissionRepo();

  /**
   * Add permission Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  public getAllPermissions = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.permissionRepository.getAll({});
    return generalResponse(req, res, responseData, 'GET_ALL_PERMISSIONS', true);
  });
}
