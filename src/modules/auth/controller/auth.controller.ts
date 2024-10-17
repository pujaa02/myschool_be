import PermissionRepo from '@/modules/permission/repository/permission.repository';
import RoleRepo from '@/modules/role/repository/role.repository';
import RolePermissionRepo from '@/modules/rolePermission/repository/rolePermission.repository';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { LoginInterface } from '../interfaces/auth.interfaces';
import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';
import Feature from '@/models/feature.model';
import Permission from '@/models/permission.model';
import Role from '@/models/role.model';
import AuthRepo from '../repository/auth.repository';

export default class AuthController {
  private authRepository = new AuthRepo();
  private rolePermissionRepository = new RolePermissionRepo();
  private roleRepository = new RoleRepo();
  private permissionRepository = new PermissionRepo();

  /**
   * user register Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public registerUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.authRepository.registerUser(req);
    return generalResponse(req, res, user, 'REGISTER_SUCCESS', true);
  });

  /**
   * user login Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public login = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.authRepository.login(req.body as LoginInterface);
    return generalResponse(req, res, responseData, 'LOGIN_SUCCESS', false);
  });

  /**
   * user login Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public logout = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.authRepository.logout(req.tokenData.user);
    return generalResponse(req, res, responseData, 'LOGIN_OUT_SUCCESS', false);
  });

  /**
   * get Logged in Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getLoggedIn = catchAsync(async (req: Request, res: Response) => {
    const {
      tokenData: { user },
    } = req;
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
        role_id: user.role_id,
      },
    });
    const role = await this.roleRepository.getAll({});

    const permission = await this.permissionRepository.getAll({});

    return generalResponse(req, res, { user, roleAndPermission, role, permission }, 'USER_FETCHED', false);
  });

  /**
   * set Password Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public setPassword = catchAsync(async (req: Request, res: Response) => {
    const data = await this.authRepository.setPassword({ user: req.tokenData?.user, password: req.body.password });
    return generalResponse(req, res, data, 'SET_PASSWORD_SUCCESS', false);
  });

  /**
   * set Password Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public changePassword = catchAsync(async (req: Request, res: Response) => {
    const data = await this.authRepository.changePassword({
      user: req.tokenData?.user,
      newPassword: req.body.newPassword,
      oldPassword: req.body.oldPassword,
    });
    return generalResponse(req, res, data, 'CHANGE_PASSWORD_SUCCESS', true);
  });
}