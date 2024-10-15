import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';
import Feature from '@/models/feature.model';
import { Request, Response } from 'express';
import _ from 'lodash';
import FeatureRepo from '../repository/feature.repository';

export default class FeatureController {
  private featureRepository = new FeatureRepo();

  /**
   * Add feature Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  public getAllFeatures = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.featureRepository.getAll({});
    return generalResponse(req, res, responseData, 'GET_ALL_FEATURES', true);
  });
}
