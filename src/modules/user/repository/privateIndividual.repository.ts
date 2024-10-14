import { FeaturesEnum, RoleEnum, queryBuildCases } from '@/common/constants/enum.constants';
import { HttpException } from '@/common/helpers/response/httpException';
import { getModuleDataTranslation } from '@/common/helpers/translation';
import { getAllDetails, getDetail } from '@/common/lib/query/querySetter/database.helper';
import { createLogMessage } from '@/common/lib/query/querySetter/databaseCommon.helper';
import * as json from '@/common/systemLogs/systemLog.json';
import { ManagePrivateIndividualCreationInterface } from '@/modules/auth/interfaces/auth.interfaces';
import BaseRepository from '@/modules/common/base.repository';
import RoleRepo from '@/modules/role/repository/role.repository';
import LogRepo from '@/modules/systemLogs/repository/systemLog.repository';
import PrivateIndividual from '@/sequelizeDir/models/privateIndividual.model';
import User from '@/sequelizeDir/models/user.model';
import { Request } from 'express';
import _ from 'lodash';
import { Transaction } from 'sequelize';
import { BuildPrivateIndividualArgs, UpdatePrivateIndividualArgs } from '../interfaces/privateIndividual.interface';
import { privateIndividualCreateReq } from '../normalizer/private-individual-create.normalizer';
import { privateIndividualUpdateReq } from '../normalizer/private-individual-update.normalizer';
import UserRepo from './user.repository';

export default class PrivateIndividualRepo extends BaseRepository<PrivateIndividual> {
  private logRepo = new LogRepo();
  private readonly userRepository = new UserRepo();
  private readonly roleRepository = new RoleRepo();
  constructor() {
    super(PrivateIndividual.name);
  }

  readonly addPrivateIndividual = async (req: Request) => {
    const { transaction, tokenData } = req;
    const { privateIndividualUserDetails, privateIndividualUserAdditionalDetails } = privateIndividualCreateReq(req);

    await this.userRepository.checkUserData({
      body: { email: privateIndividualUserDetails.email },
      role: RoleEnum.PrivateIndividual,
      transaction,
    });
    const privateIndividualUser = await this.userRepository.addUser({
      data: { ...privateIndividualUserDetails },
      tokenData,
      transaction,
      shouldSentMail: true,
    });

    await this.createPrivateIndividualRepo({
      data: {
        ...privateIndividualUserAdditionalDetails,
      },
      buildUserResp: privateIndividualUser,
      transaction,
    });
    await createLogMessage(
      req,
      json.PRIVATE_INDIVIDUAL_ADD_SUCCESS,
      FeaturesEnum.PrivateIndividual,
      'Private Individual added',
      privateIndividualUser.userIdLangMap.italian,
      this.logRepo,
      {
        additionalMessageProps: {
          additionalMessageProps: req.body.codice_fiscale,
          individualName: `${req.body.first_name} ${req.body.last_name}`,
        },
      },
    );
    return privateIndividualUser;
  };

  readonly updatePrivateIndividualRepo = async (privateIndividualUpdateArgs: UpdatePrivateIndividualArgs) => {
    const { data, privateIndividual, transaction, tokenData } = privateIndividualUpdateArgs;

    const { moduleIdLangMap: privateIndividualIdLangMap } = await getModuleDataTranslation(PrivateIndividual.name, {
      data: {
        ...data,
      },
      fields: ['job_title'],
      slugKeyModule: 'slug',
      transaction,
      user_id: tokenData.user.id,
      onlyDefaultLang: true,
      module_id: privateIndividual?.id,
      tokenData,
      convert: false,
    });

    return privateIndividualIdLangMap;
  };

  readonly updatePrivateIndividual = async (req: Request) => {
    const { tokenData, transaction, files } = req;
    const username = req.params?.username;

    const { privateIndividualUserAdditionalDetails, privateIndividualUserDetails } = privateIndividualUpdateReq(req);

    const user = await this.userRepository.get({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException(404, 'USER_NOT_FOUND');
    }

    const privateIndividual = await this.get({ where: { user_id: user.id } });

    if (!privateIndividual) {
      throw new HttpException(404, 'PRIVATE_INDIVIDUAL_NOT_FOUND');
    }

    await this.updatePrivateIndividualRepo({
      data: privateIndividualUserAdditionalDetails,
      privateIndividual,
      transaction,
      tokenData,
    });
    const updateManagerUser = await this.userRepository.updateUser({
      data: privateIndividualUserDetails,
      user,
      transaction,
      shouldSentMail: false,
      tokenData,
      files,
    });
    if (req.body.codice_fiscale !== privateIndividual.codice_fiscale || req.body.job_title !== privateIndividual.job_title) {
      await createLogMessage(
        { tokenData: tokenData },
        json.PRIVATE_INDIVIDUAL_UPDATE_SUCCESS,
        FeaturesEnum.PrivateIndividual,
        'Private Individual updated',
        updateManagerUser.id,
        this.logRepo,
        { additionalMessageProps: { individualName: updateManagerUser.full_name } },
      );
    }
    return updateManagerUser;
  };

  readonly managePrivateIndividualCreation = async (data: ManagePrivateIndividualCreationInterface) => {
    const { privateIndividualUserDetails, privateIndividualUserAdditionalDetails, transaction, tokenData } = data;

    await this.userRepository.checkUserData({
      body: { email: privateIndividualUserDetails.email },
      role: RoleEnum.CompanyManager,
      transaction,
    });
    const managerUser = await this.userRepository.addUser({
      data: { ...privateIndividualUserDetails },
      tokenData,
      transaction,
      shouldSentMail: true,
    });

    await this.createPrivateIndividualRepo({
      data: {
        ...privateIndividualUserAdditionalDetails,
      },
      buildUserResp: managerUser,
      transaction,
    });

    return managerUser;
  };

  readonly createPrivateIndividualRepo = async (privateIndividualArgs: BuildPrivateIndividualArgs) => {
    const { data, transaction, buildUserResp } = privateIndividualArgs;

    await getModuleDataTranslation(PrivateIndividual.name, {
      data: {
        ...data,
        ...(buildUserResp?.userIdLangMap ? { user_id: Object.values(buildUserResp?.userIdLangMap)[0] } : {}),
      },
      fields: ['job_title'],
      slugKeyModule: 'slug',
      transaction,
      user_id: Object.values(buildUserResp?.userIdLangMap)[0],
      onlyDefaultLang: true,
      convert: false,
    });
  };

  readonly getAllPrivateIndividualDetails = async (req: Request) => {
    const privateIndividualRole = await this.roleRepository.getRoleByName(RoleEnum.PrivateIndividual);
    if (!privateIndividualRole) {
      throw new HttpException(404, 'NOT_FOUND');
    }
    _.set(req.query, 'q[role_id]', privateIndividualRole.id);
    return await getAllDetails(User, User.name, queryBuildCases.getAllPrivateIndividualDetails, req);
  };

  readonly getPrivateIndividualDetail = async (req: Request) => {
    const username = req.params?.username;
    const user = await this.userRepository.get({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException(404, 'USER_NOT_FOUND');
    }

    _.set(req.query, 'q[id]', user.id);
    return await getDetail(User, User.name, queryBuildCases.getPrivateIndividualDetails, req);
  };

  readonly deletePrivateIndividual = async (req: Request) => {
    const { transaction } = req;
    const username = req.params?.username;
    const user = await this.userRepository.get({
      where: {
        username,
      },
    });
    if (!user) {
      throw new HttpException(404, 'USER_NOT_FOUND');
    }

    await this.userRepository.deleteUser(req, { where: { id: user.id }, transaction });
    return await this.deleteData({ where: { user_id: user.id }, transaction });
  };

  readonly getPrivateIndividualByUserId = async (user_id: number, transaction: Transaction) => {
    return await this.get({
      where: {
        user_id,
      },
      transaction,
    });
  };
}
