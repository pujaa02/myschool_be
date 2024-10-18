import { Request, Response } from 'express';
import _ from 'lodash';
import UserRepo from '../repository/user.repository';
import { catchAsync } from '@/common/util';
import { generalResponse } from '@/common/helper/response/generalResponse';
import { HttpException } from '@/common/helper/response/httpException';
import User from '@/models/user.model';
import { queryBuildCases } from '@/common/constants/enum.constant';
import { getAllDetails, getDetail } from '@/common/lib/query/querySetter/database.helper';

export default class UserController {
  private readonly userRepository: UserRepo = new UserRepo();
  constructor() {
    // do nothing.
  }

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

    return generalResponse(req, res, result, 'USER_CREATE', true);
  });

  public readonly updateUser = catchAsync(async (req: Request, res: Response) => {
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

  public readonly getUserDetailsById = catchAsync(async (req: Request, res: Response) => {
    const { tokenData } = req;
    const username = req.params.username ? req.params.username : tokenData?.user?.username;
    _.set(req.query, 'q[username]', username);
    const responseData = await getDetail(User, User.name, queryBuildCases.getAllRoleWiseData, req);
    return generalResponse(req, res, responseData, 'USER_FETCHED', false);
  });

  public readonly getUserDetails = catchAsync(async (req: Request, res: Response) => {
    const responseData = await getAllDetails(User, User.name, queryBuildCases.getAllRoleWiseData, req);
    return generalResponse(req, res, responseData, 'USER_FETCHED', false);
  });

  public readonly deleteUser = catchAsync(async (req: Request, res: Response) => {
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

  public readonly bulkCreateUser = catchAsync(async (req: Request, res: Response) => {
    const { body, tokenData, transaction } = req;

    const result = await this.userRepository.bulkAddUser({ data: body, tokenData, transaction, shouldSentMail: true });
    return generalResponse(req, res, result, 'USERS_CREATE_SUCCESS', true);
  });
}
