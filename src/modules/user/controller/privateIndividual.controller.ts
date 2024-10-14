import { queryBuildCases } from '@/common/constants/enum.constants';
import { generalResponse } from '@/common/helpers/response/generalResponse';
import { getAllDetails } from '@/common/lib/query/querySetter/database.helper';
import { catchAsync } from '@/common/utils';
import Course from '@/sequelizeDir/models/course.model';
import { Request, Response } from 'express';
import PrivateIndividualRepo from '../repository/privateIndividual.repository';

export default class PrivateIndividualController {
  private privateIndividualRepository = new PrivateIndividualRepo();

  /**
   * Create private individual
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public createPrivateIndividual = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.privateIndividualRepository.addPrivateIndividual(req);
    return generalResponse(req, res, responseData, 'PRIVATE_INDIVIDUAL_CREATE', true);
  });

  /**
   * Update private individual
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public updatePrivateIndividual = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.privateIndividualRepository.updatePrivateIndividual(req);
    return generalResponse(req, res, responseData, 'PRIVATE_INDIVIDUAL_UPDATE', true);
  });

  /**
   * Update private individual
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getCourseList = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(Course, Course.name, queryBuildCases.getAllPrivateIndividualCourse, req);
    data.is_private_individual_id_enrolled =
      req?.query?.course_slug && data?.enrolled_courses?.length && req.query?.private_individual_id ? true : false;
    data.purchase_date = data?.enrolled_courses?.[0]?.created_at;
    return generalResponse(req, res, data, 'PRIVATE_INDIVIDUAL_UPDATE', false);
  });

  /**
   * get all private individual detail Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllPrivateIndividualDetails = catchAsync(async (req: Request, res: Response) => {
    const data = await this.privateIndividualRepository.getAllPrivateIndividualDetails(req);
    return generalResponse(req, res, data, 'PRIVATE_INDIVIDUAL_GETALL', false);
  });

  /**
   * get private individual detail Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getPrivateIndividualDetail = catchAsync(async (req: Request, res: Response) => {
    const data = await this.privateIndividualRepository.getPrivateIndividualDetail(req);
    return generalResponse(req, res, data, 'PRIVATE_INDIVIDUAL_GET', false);
  });

  /**
   * delete private individual Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public deletePrivateIndividual = catchAsync(async (req: Request, res: Response) => {
    const data = await this.privateIndividualRepository.deletePrivateIndividual(req);
    return generalResponse(req, res, data, 'PRIVATE_INDIVIDUAL_DELETE', true);
  });
}
