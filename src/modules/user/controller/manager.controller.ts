import { queryBuildCases } from '@/common/constants/enum.constants';
import { generalResponse } from '@/common/helpers/response/generalResponse';
import { getAllDetails } from '@/common/lib/query/querySetter/database.helper';
import { catchAsync } from '@/common/utils';
import CompanyManager from '@/sequelizeDir/models/companyManager.model';
import Manager from '@/sequelizeDir/models/manager.model';
import { Request, Response } from 'express';
import _ from 'lodash';
import ManagerRepo from '../repository/manager.repository';

export default class ManagerController {
  private managerRepository = new ManagerRepo();

  /**
   * Create manager
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public createManager = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.managerRepository.addManager(req);
    return generalResponse(req, res, responseData, 'MANAGER_CREATE', false);
  });

  /**
   * Create manager
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public updateManager = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.managerRepository.updateManager(req);
    return generalResponse(req, res, responseData, 'MANAGER_UPDATE', true);
  });

  /**
   * get managers for company Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getManagersForCompany = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.managerRepository.getManagersWhichNotInProvidedCompany(req);
    return generalResponse(req, res, responseData, 'MANAGER_GETALL', false);
  });

  /**
   * get all managers detail Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllManagersDetails = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(CompanyManager, CompanyManager.name, queryBuildCases.getAllManagersDetails, req);
    return generalResponse(req, res, data, 'MANAGER_GETALL', false);
  });

  /**
   * get manager detail Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getManagerDetail = catchAsync(async (req: Request, res: Response) => {
    const username = req.params?.username;

    _.set(req.query, 'username', username);
    _.set(req.query, 'companyId', req.query.companyId);
    const data = await getAllDetails(Manager, Manager.name, queryBuildCases.getManagerDetails, req);
    return generalResponse(req, res, data, 'MANAGER_GET', false);
  });

  /**
   * delete manager Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public deleteCompanyManager = catchAsync(async (req: Request, res: Response) => {
    const data = await this.managerRepository.deleteCompanyManager(req);
    return generalResponse(req, res, data, 'MANAGER_DELETE', false);
  });

  public getManagerDropDownList = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.managerRepository.getManagerDropDownList(req);
    return generalResponse(req, res, responseData, 'MANAGER_GET', false);
  });
}
