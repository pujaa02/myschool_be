import { queryBuildCases } from '@/common/constants/enum.constants';
import { generalResponse } from '@/common/helpers/response/generalResponse';
import { getAllDetails } from '@/common/lib/query/querySetter/database.helper';
import { catchAsync } from '@/common/utils';
import SystemLogs from '@/sequelizeDir/models/systemLogs.model';
import { Request, Response } from 'express';
import LogRepo from '../repository/systemLog.repository';

export default class LogController {
  private LogRepo = new LogRepo();

  /**
   * create System Log Api
   * @param {Request}  req
   * @param {Response} res
   */

  public createSystemLog = catchAsync(async (req: Request, res: Response) => {
    const data = await this.LogRepo.createLog(
      {
        ...req.body,
      },
      req,
    );
    return generalResponse(req, res, data, 'Log_ADDED_SUCCESS', true);
  });

  /**
   * Get All System Logs Api
   * @param {Request}  req
   * @param {Response} res
   */
  public getLogList = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(SystemLogs, SystemLogs.name, queryBuildCases.getAllLogs, req);
    return generalResponse(req, res, data, 'Log_FETCHED_SUCCESS', false);
  });

  /**
   * Delete System Log Api
   * @param {Request}  req
   * @param {Response} res
   */

  public deleteLog = catchAsync(async (req: Request, res: Response) => {
    const logSlug = req?.params?.slug;
    const responseData = await this.LogRepo.deleteLog(logSlug);
    return generalResponse(req, res, responseData, 'LOG_DELETED_SUCCESS', true);
  });
}
