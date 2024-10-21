import { Request, Response } from 'express';
import PermissionRepo from '../repository/permission.repository';
import { generalResponse } from '../../../common/helper/response/generalResponse';
import { catchAsync } from '../../../common/util';

export default class PermissionController {
  private readonly permissionRepository = new PermissionRepo();

  constructor() {
    // do nothing.
  }
  public readonly getAllPermissions = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.permissionRepository.getAll({});
    return generalResponse(req, res, responseData, 'GET_ALL_PERMISSIONS', true);
  });
}
