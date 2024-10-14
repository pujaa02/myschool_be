import { queryBuildCases } from '@/common/constants/enum.constants';
import { generalResponse } from '@/common/helpers/response/generalResponse';
import { HttpException } from '@/common/helpers/response/httpException';
import { getAllDetails, getDetail } from '@/common/lib/query/querySetter/database.helper';

import { catchAsync } from '@/common/utils';
import User from '@/sequelizeDir/models/user.model';
import UserSocialAccount from '@/sequelizeDir/models/userSocialAccount.model';
import UserRepo from '@modules/user/repository/user.repository';
import { Request, Response } from 'express';
import _ from 'lodash';
import UserSocialAccountRepo from '../repository/userSocialAccount.repository';

export default class UserController {
  private userRepository = new UserRepo();
  private userSocialAccountRepository = new UserSocialAccountRepo();

  /**
   * Add user Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const { body, tokenData, transaction, files } = req;
    await this.userRepository.checkUserData({ body });
    const result = await this.userRepository.addUser({ data: body, tokenData, transaction, shouldSentMail: true, files });

    return generalResponse(req, res, result, 'USER_CREATE', true);
  });

  /**
   * Update user Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public updateUser = catchAsync(async (req: Request, res: Response) => {
    const { body, tokenData, transaction, files } = req;
    const username = req.params.username ? req.params.username : tokenData?.user?.username;

    const user = await this.userRepository.get({
      where: { username },
      rejectOnEmpty: false,
    });

    if (!user) {
      throw new HttpException(404, 'USER_NOT_FOUND');
    }

    const result = await this.userRepository.updateUser({
      data: body,
      tokenData,
      transaction,
      user,
      shouldSentMail: false,
      files,
    });

    return generalResponse(req, res, result, 'USER_UPDATE', true);
  });

  /**
   * get user Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getUserDetailsById = catchAsync(async (req: Request, res: Response) => {
    const { tokenData } = req;
    const username = req.params.username ? req.params.username : tokenData?.user?.username;
    _.set(req.query, 'q[username]', username);
    const responseData = await getDetail(User, User.name, queryBuildCases.getAllRoleWiseData, req);
    return generalResponse(req, res, responseData, 'USER_FETCHED', false);
  });

  public getUserDetails = catchAsync(async (req: Request, res: Response) => {
    const responseData = await getAllDetails(User, User.name, queryBuildCases.getAllRoleWiseData, req);
    return generalResponse(req, res, responseData, 'USER_FETCHED', false);
  });

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { tokenData, transaction } = req;
    const username = req.params.username ? req.params.username : tokenData.user.username;

    const user = await this.userRepository.get({
      where: { username },
      rejectOnEmpty: false,
    });

    if (!user) throw new HttpException(404, 'USER_NOT_FOUND');

    const result = await this.userRepository.deleteUser(req, { where: { username }, transaction });

    return generalResponse(req, res, result, 'USER_DELETED', true);
  });

  public getUserSocialAccounts = catchAsync(async (req: Request, res: Response) => {
    const responseData = await getAllDetails(
      UserSocialAccount,
      UserSocialAccount.name,
      queryBuildCases.getUserSocialAccounts,
      req,
    );
    return generalResponse(req, res, responseData, 'GET_USER_SOCIAL_CONNECTIONS', false);
  });

  public deleteUserSocialAccounts = catchAsync(async (req: Request, res: Response) => {
    const deletedAccount = await this.userSocialAccountRepository.deleteData({
      where: { id: req.body?.user_social_account_id },
      force: true,
    });
    return generalResponse(req, res, deletedAccount, 'DELETE_USER_SOCIAL_CONNECTIONS', false);
  });

  public bulkCreateUser = catchAsync(async (req: Request, res: Response) => {
    const { body, tokenData, transaction } = req;

    const result = await this.userRepository.bulkAddUser({ data: body, tokenData, transaction, shouldSentMail: true });
    return generalResponse(req, res, result, 'USERS_CREATE_SUCCESS', true);
  });

  public getUserDropdownData = catchAsync(async (req: Request, res: Response) => {
    const responseData = await getAllDetails(User, User.name, queryBuildCases.getUserDropdownData, req);
    return generalResponse(req, res, responseData, 'USER_FETCHED', false);
  });
}
