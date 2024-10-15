
import { Request, Response } from 'express';
import PermissionRepo from '../repository/permission.repository';
import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';

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
