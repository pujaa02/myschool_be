import { Request, Response } from 'express';
import RoleRepo from '../repository/role.repository';
import { generalResponse } from '../../../common/helper/response/generalResponse';
import { catchAsync } from '../../../common/util';

export default class RoleController {
  private readonly roleRepository = new RoleRepo();

  constructor() {
    // do nothing.
  }

  public readonly getAllRoles = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.roleRepository.getAll({});
    return generalResponse(req, res, responseData, 'GET_ALL_ROLES', false);
  });
}
