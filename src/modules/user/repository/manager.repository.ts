import { FeaturesEnum, PermissionEnum, RoleEnum, queryBuildCases } from '@/common/constants/enum.constants';
import { HttpException } from '@/common/helpers/response/httpException';
import { getModuleDataTranslation, manageJunctionTableTranslation } from '@/common/helpers/translation';
import { getAllDetails } from '@/common/lib/query/querySetter/database.helper';
import { createLogMessage } from '@/common/lib/query/querySetter/databaseCommon.helper';
import * as json from '@/common/systemLogs/systemLog.json';
import {
  ManageManagerCreationInterface,
  ManageManagerWithMultiCompanyCreationInterface,
} from '@/modules/auth/interfaces/auth.interfaces';
import BaseRepository from '@/modules/common/base.repository';
import CompanyRepo from '@/modules/company/repository/company.repository';
import RoleRepo from '@/modules/role/repository/role.repository';
import LogRepo from '@/modules/systemLogs/repository/systemLog.repository';
import db from '@/sequelizeDir/models';
import Company from '@/sequelizeDir/models/company.model';
import CompanyManager from '@/sequelizeDir/models/companyManager.model';
import Manager from '@/sequelizeDir/models/manager.model';
import User from '@/sequelizeDir/models/user.model';
import { Request } from 'express';
import _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
import { BuildManagerArgs, BuildManagerResp, UpdateManagerArgs } from '../interfaces/manager.interface';
import { managerCreateReq } from '../normalizer/manager-create.normalizer';
import { managerUpdateReq } from '../normalizer/manager-update.normalizer';
import CompanyManagerRepo from './companyManager.repository';
import UserRepo from './user.repository';

export default class ManagerRepo extends BaseRepository<Manager> {
  private logRepo = new LogRepo();
  private readonly userRepository = new UserRepo();
  private readonly companyManagerRepository = new CompanyManagerRepo();
  private readonly roleRepository = new RoleRepo();
  constructor() {
    super(Manager.name);
  }

  readonly addManager = async (req: Request) => {
    const { tokenData, transaction } = req;

    const { managerUserAdditionalDetails, managerUserDetails } = managerCreateReq(req);
    const companyIds = req?.body?.companies.length > 0 ? req?.body?.companies.split(',') : [];

    const companies = await (<ModelCtor<Company>>db.models.Company).findAll({
      where: {
        id: {
          [Op.in]: companyIds,
        },
      },
    });

    if (companies.length !== companyIds.length) {
      throw new HttpException(400, 'INVALID_COMPANIES_PROVIDED');
    }

    const data = await this.manageManagerWithMultiCompanyCreation({
      companies,
      tokenData,
      transaction,
      managerUserAdditionalDetails,
      managerUserDetails,
    });
    const companiesName = companies.map((obj) => obj.name).join(', ');
    await createLogMessage(
      req,
      json.COMPANY_MANAGER_ADD_SUCCESS,
      FeaturesEnum.CompanyManager,
      'Company manager added',
      data.userIdLangMap.italian,
      this.logRepo,
      {
        additionalMessageProps: {
          additionalMessageProps: companiesName,
          managerName: req.body.first_name + ' ' + req.body.last_name,
        },
      },
      PermissionEnum.Create,
    );
    return data;
  };

  readonly updateManagerRepo = async (companyUpdateArgs: UpdateManagerArgs) => {
    const { data, manager, transaction, tokenData } = companyUpdateArgs;

    const { moduleIdLangMap: managerIdLangMap } = await getModuleDataTranslation(Manager.name, {
      data: {
        ...data,
      },
      fields: [
        'job_title',
        'billing_address1',
        'billing_address2',
        'billing_city',
        'billing_country',
        'billing_state',
        'billing_zip',
      ],
      slugKeyModule: 'slug',
      transaction,
      user_id: tokenData.user.id,
      onlyDefaultLang: true,
      module_id: manager.id,
      tokenData,
      convert: false,
    });

    return managerIdLangMap;
  };

  readonly updateManager = async (req: Request) => {
    const { tokenData, transaction, files } = req;
    const username = req.params?.username;
    const companyIds = req?.body?.companies ? req?.body?.companies.split(',').map((id) => parseInt(id)) : [];
    const { managerUserAdditionalDetails, managerUserDetails, companyAdditionalDetails } = managerUpdateReq(req);
    const user = await this.userRepository.get({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException(404, 'USER_NOT_FOUND');
    }

    const manager = await this.get({ where: { user_id: user.id } });

    if (!manager) {
      throw new HttpException(404, 'MANAGER_NOT_FOUND');
    }

    await this.updateManagerRepo({ data: managerUserAdditionalDetails, manager, transaction, tokenData });
    const updateManagerUser = await this.userRepository.updateUser({
      data: managerUserDetails,
      user,
      transaction,
      shouldSentMail: false,
      tokenData,
      files,
    });

    //manage company & manager relation
    await manageJunctionTableTranslation(Manager.name, Company.name, CompanyManager.name, {
      primaryModuleId: manager.id,
      primaryModuleAssociationKey: 'manager_id',
      secondaryModuleIds: [...companyIds],
      secondayModuleAssociationKey: 'company_id',
      transaction,
      user_id: tokenData.user.id,
      onlyDefaultLang: true,
      tokenData,
    });
    if (companyAdditionalDetails.id) {
      const companyRepoInstance = new CompanyRepo();

      const company = await companyRepoInstance.getCompany({
        where: {
          id: companyAdditionalDetails.id,
        },
      });

      if (!company) {
        throw new HttpException(404, 'COMPANY_NOT_FOUND');
      }

      await companyRepoInstance.updateCompanyRepo({ company, data: companyAdditionalDetails, tokenData, transaction });
    }
    if (manager.job_title !== req.body.job_title) {
      await createLogMessage(
        req,
        json.COMPANY_MANAGER_UPDATE_SUCCESS,
        FeaturesEnum.CompanyManager,
        'Company manager updated',
        updateManagerUser.id,
        this.logRepo,
        { additionalMessageProps: { managerName: updateManagerUser.full_name } },
        PermissionEnum.Update,
      );
    }
    return updateManagerUser;
  };

  readonly manageManagerCreation = async (data: ManageManagerCreationInterface) => {
    const { managerUserDetails, managerUserAdditionalDetails, transaction, tokenData, company } = data;

    await this.userRepository.checkUserData({
      body: { email: managerUserDetails.email },
      role: RoleEnum.CompanyManager,
      transaction,
    });
    const managerUser = await this.userRepository.addUser({
      data: { ...managerUserDetails },
      tokenData,
      transaction,
      shouldSentMail: true,
    });

    const managerInfo = await this.createManagerRepo({
      data: {
        ...managerUserAdditionalDetails,
      },
      user: managerUser,
      transaction,
      tokenData,
    });

    await manageJunctionTableTranslation(Company.name, Manager.name, CompanyManager.name, {
      primaryModuleId: Object.values(company.companyIdLangMap)[0],
      primaryModuleAssociationKey: 'company_id',
      secondaryModuleIds: [Object.values(managerInfo.managerIdLangMap)[0]],
      secondayModuleAssociationKey: 'manager_id',
      transaction,
      ...(tokenData?.user?.id ? { user_id: tokenData?.user?.id } : {}),
      onlyDefaultLang: true,
      tokenData,
      convert: false,
    });

    return managerUser;
  };

  readonly createManagerRepo = async (managerArgs: BuildManagerArgs): Promise<BuildManagerResp> => {
    const { data, transaction, user, tokenData } = managerArgs;

    const { moduleIdLangMap: managerIdLangMap } = await getModuleDataTranslation(Manager.name, {
      data: {
        ...data,
        user_id: Object.values(user?.userIdLangMap)[0],
        job_title: data.job_title,
        billing_address1: data.billing_address1,
        billing_address2: data.billing_address2,
        billing_city: data.billing_city,
        billing_state: data.billing_state,
        billing_country: data.billing_country,
        billing_zip: data.billing_zip,
      },
      fields: ['job_title', 'billing_address1', 'billing_address2', 'billing_city', 'billing_state', 'billing_country'],
      slugKeyModule: 'slug',
      transaction,
      user_id: tokenData?.user?.id || Object.values(user?.userIdLangMap)[0],
      onlyDefaultLang: true,
      tokenData,
      convert: false,
    });

    return {
      managerIdLangMap,
    };
  };

  readonly manageManagerWithMultiCompanyCreation = async (data: ManageManagerWithMultiCompanyCreationInterface) => {
    const { managerUserDetails, managerUserAdditionalDetails, transaction, tokenData, companies } = data;

    await this.userRepository.checkUserData({
      body: { email: managerUserDetails.email },
      role: RoleEnum.CompanyManager,
      transaction,
    });
    const managerUser = await this.userRepository.addUser({
      data: { ...managerUserDetails },
      tokenData,
      transaction,
      shouldSentMail: true,
    });

    const managerInfo = await this.createManagerRepo({
      data: {
        ...managerUserAdditionalDetails,
      },
      user: managerUser,
      transaction,
      tokenData,
    });

    await manageJunctionTableTranslation(Manager.name, Company.name, CompanyManager.name, {
      primaryModuleId: Object.values(managerInfo.managerIdLangMap)[0],
      primaryModuleAssociationKey: 'manager_id',
      secondaryModuleIds: [...companies.map((company) => company.id)],
      secondayModuleAssociationKey: 'company_id',
      transaction,
      user_id: tokenData.user.id,
      onlyDefaultLang: true,
      tokenData,
      convert: false,
    });

    return managerUser;
  };

  readonly getManagersWhichNotInProvidedCompany = async (req: Request, ignorePagination = false) => {
    const roleId = (await this.roleRepository.getRoleByName(RoleEnum.CompanyManager)).id;

    if (!roleId) {
      throw new HttpException(404, 'NOT_FOUND');
    }
    req.query.roleId = roleId.toString();

    const responseData = await getAllDetails(
      User,
      User.name,
      queryBuildCases.getUsersNotInCompanyProvided,
      req,
      true,
      ignorePagination,
    );
    return responseData;
  };

  readonly deleteCompanyManager = async (req: Request) => {
    const { transaction } = req;
    const id = req.params?.id;
    const managerName = await Manager.findOne({ where: { id }, include: [{ model: User }], transaction });
    await createLogMessage(
      req,
      json.COMPANY_MANAGER_DELETE_SUCCESS,
      FeaturesEnum.CompanyManager,
      'Company Manager deleted',
      id,
      this.logRepo,
      { additionalMessageProps: { managerName: managerName?.user?.first_name + ' ' + managerName?.user?.last_name } },
      PermissionEnum.Delete,
    );

    return await this.companyManagerRepository.deleteData({ where: { manager_id: id }, transaction });
  };

  readonly getManagerByUserId = async (user_id: number, transaction: Transaction) => {
    return await this.get({
      where: {
        user_id,
      },
      transaction,
    });
  };

  readonly getManagerDropDownList = async (req: Request) => {
    _.set(req.query, 'dropdown', true); //strict
    _.set(req.query, 'value', 'id'); //strict
    _.set(req.query, 'label', 'full_name'); //strict

    const roleId = await this.roleRepository.get({ where: { name: RoleEnum.CompanyManager } });
    _.set(req.query, 'q[role_id]', roleId.id);
    return await getAllDetails(User, User.name, queryBuildCases.getManagerDropdown, req);
  };
}
