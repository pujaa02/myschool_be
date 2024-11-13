import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import UserRepo from '../repository/user.repository';
import { catchAsync } from '../../../common/util';
import { generalResponse } from '../../../common/helper/response/generalResponse';
import User from '../../../models/user.model';
import { queryBuildCases } from '../../../common/constants/enum.constant';
import { getAllDetails } from '../../../common/lib/query/querySetter/database.helper';
import Role from '../../../models/role.model';
import UserOrganizationRepo from '../../../modules/userOrganization/repository/userOrganization.repository';
import { Sequelize } from 'sequelize';
import Permission from '../../../models/permission.model';
import Feature from '../../../models/feature.model';
import RolePermissionRepo from '../../../modules/rolePermission/repository/rolePermission.repository';
import RoleRepo from '../../../modules/role/repository/role.repository';
import PermissionRepo from '../../../modules/permission/repository/permission.repository';

export default class UserController {
  private readonly userRepository: UserRepo = new UserRepo();
  public userOrganizationRepo = new UserOrganizationRepo();
  private rolePermissionRepository = new RolePermissionRepo();
  private roleRepository = new RoleRepo();
  private permissionRepository = new PermissionRepo();
  constructor() {
    // do nothing.
  }

  public readonly getLoggedInUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.tokenData;
    console.log('🚀 ~ UserController ~ readonlygetLoggedInUser=catchAsync ~ user:', user.role);
    const roleAndPermission = await this.rolePermissionRepository.getAll({
      include: [
        {
          model: Feature,
          attributes: [],
        },
        {
          model: Permission,
          attributes: [],
        },
        {
          model: Role,
          attributes: [],
        },
      ],
      attributes: [
        'access',
        [Sequelize.col('feature.name'), 'feature_name'],
        [Sequelize.col('role.name'), 'role_name'],
        [Sequelize.col('feature.id'), 'feature_id'],
        [Sequelize.col('permission.name'), 'permission_name'],
        [Sequelize.col('permission.id'), 'permission_id'],
      ],
      where: {
        role_id: user.role.id,
      },
    });
    console.log('🚀 ~ UserController ~ readonlygetLoggedInUser=catchAsync ~ roleAndPermission:', roleAndPermission);
    const role = await this.roleRepository.getAll({});

    const permission = await this.permissionRepository.getAll({});

    return generalResponse(res, { user, roleAndPermission, role, permission }, 'USER_FETCHED');
  });

  public readonly createUser = catchAsync(async (req: Request, res: Response) => {
    const { body, tokenData, transaction, files } = req;
    await this.userRepository.checkUserData({ body });
    const result = await this.userRepository.addUser({
      data: body,
      tokenData,
      transaction,
      shouldSentMail: true,
      files,
    });

    return generalResponse(res, result, 'USER_CREATE', 'error', true);
  });

  // public readonly updateUser = catchAsync(async (req: Request, res: Response) => {
  //   const { body, tokenData, transaction, files } = req;
  //   const username = req.params.username ? req.params.username : tokenData?.user?.username;

  //   const user = await this.userRepository.get({
  //     where: { username },
  //     rejectOnEmpty: false,
  //   });

  //   if (!user) {
  //     throw new HttpException(404, 'USER_NOT_FOUND');
  //   }

  //   const result = await this.userRepository.updateUser({
  //     data: body,
  //     tokenData,
  //     transaction,
  //     user,
  //     shouldSentMail: false,
  //     files,
  //   });

  //   return generalResponse( res, result, 'USER_UPDATE','error', true);
  // });

  // public readonly getUserDetailsById = catchAsync(async (req: Request, res: Response) => {
  //   const { tokenData } = req;
  //   const username = req.params.username ? req.params.username : tokenData?.user?.username;
  //   _.set(req.query, 'q[username]', username);
  //   const responseData = await getDetail(User, User.name, queryBuildCases.getAllRoleWiseData, req);
  //   return generalResponse( res, responseData, 'USER_FETCHED','error', false);
  // });

  public readonly getUserDetails = catchAsync(async (req: Request, res: Response) => {
    const responseData = await getAllDetails(User, User.name, queryBuildCases.getAllRoleWiseData, req);
    return generalResponse(res, responseData, 'USER_FETCHED', 'error', false);
  });

  // public readonly deleteUser = catchAsync(async (req: Request, res: Response) => {
  //   const { tokenData, transaction } = req;
  //   const username = req.params.username ? req.params.username : tokenData.user.username;

  //   const user = await this.userRepository.get({
  //     where: { username },
  //     rejectOnEmpty: false,
  //   });

  //   if (!user) throw new HttpException(404, 'USER_NOT_FOUND');

  //   const result = await this.userRepository.deleteUser(req, { where: { username }, transaction });

  //   return generalResponse( res, result, 'USER_DELETED','error', true);
  // });

  public readonly bulkCreateUser = catchAsync(async (req: Request, res: Response) => {
    const { body, tokenData, transaction } = req;

    const result = await this.userRepository.bulkAddUser({ data: body, tokenData, transaction, shouldSentMail: true });
    return generalResponse(res, result, 'USERS_CREATE_SUCCESS', 'error', true);
  });
}
