import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import UserRepo from '../repository/user.repository';
import { catchAsync } from '../../../common/util';
import { generalResponse } from '../../../common/helper/response/generalResponse';
import User from '../../../models/user.model';
import { queryBuildCases } from '../../../common/constants/enum.constant';
import { getAllDetails, getDetail } from '../../../common/lib/query/querySetter/database.helper';
import Role from '../../../models/role.model';
import UserOrganization from '../../../models/userOrganization.model';
import UserOrganizationRepo from '../../../modules/userOrganization/repository/userOrganization.repository';

export default class UserController {
  private readonly userRepository: UserRepo = new UserRepo();
  public userOrganizationRepo = new UserOrganizationRepo();
  constructor() {
    // do nothing.
  }

  public readonly getLoggedInUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, organization_id } = req.tokenData;
      const user: User & { organization?: UserOrganization } = await this.userRepository.get({
        where: { id },
        include: [
          {
            model: Role.scope({ method: ['defaultOrganization', organization_id] }),
            required: false,
            include: [
              {
                model: Role.scope({ method: ['defaultOrganization', organization_id] }),
                attributes: ['id', 'name'],
                required: false,
              },
            ],
          },
        ],
        rejectOnEmpty: false,
      });

      const organizations = await this.userOrganizationRepo.getAll({
        where: { user_id: id },
        include: [
          {
            model: User,
            attributes: ['id', 'first_name', 'last_name'],
            required: true,
          },
        ],
      });

      // const permissions = await this.permissionGroupRepository.getPermissions({
      //   role_id: user.user_roles?.[0]?.role_id,
      //   organization_id,
      //   withoutAll: false,
      // });

      // permissions.forEach((obj) => {
      //   obj.permissions = obj.permissions.map((permission) => {
      //     permission.status = _.clone(permission.role_permissions[0].status);
      //     return permission;
      //   });
      // });

      return generalResponse(res, {
        user: {
          ...user.toJSON(),
          organization: organizations.find((obj) => obj.id === organization_id),
          user_organizations: organizations,
        },
        two_factor_enabled: req.tokenData.two_factor_enabled,
        two_factor_verified: req.tokenData.two_factor_verified,
        // permissions,
      });
    } catch (error) {
      return next(error);
    }
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
