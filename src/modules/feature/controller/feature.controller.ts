import { queryBuildCases } from '@/common/constants/enum.constants';
import { getAllDetails } from '@/common/lib/query/querySetter/database.helper';
import { catchAsync } from '@/common/utils';
import Feature from '@/sequelizeDir/models/feature.model';
import SystemLogs from '@/sequelizeDir/models/systemLogs.model';
import { generalResponse } from '@helpers/response/generalResponse';
import FeatureRepo from '@modules/feature/repository/feature.repository';
import { Request, Response } from 'express';
import _ from 'lodash';

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

  public getFeatureDropDownList = catchAsync(async (req: Request, res: Response) => {
    const SystemLog = await SystemLogs.findAll({ attributes: ['feature_id'] });
    const feature_ids = SystemLog.map((feat) => feat.feature_id);
    _.set(req.query, 'q[id][in]', feature_ids);
    _.set(req.query, 'dropdown', true); //strict
    _.set(req.query, 'value', 'id'); //strict
    _.set(req.query, 'label', 'name'); //strict
    const responseData = await getAllDetails(Feature, Feature.name, queryBuildCases.getFeatureDropdown, req);
    return generalResponse(req, res, responseData, 'COMPANY_GET', false);
  });
}
