import { Request, Response } from 'express';
import { getCitiesJson, getCountriesJson, getStateJson } from '../../../common/countries';
import { generalResponse } from '../../../common/helper/response/generalResponse';
import { catchAsync } from '../../../common/util';
// import LanguageModel from '@/models/language.model';
export default class PublicController {
  /**
   * get Logged in Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getLoggedIn = catchAsync(async (req: Request, res: Response) => {
    const countries = getCountriesJson(req.language);
    const states = getStateJson(req.language);
    const cities = getCitiesJson(req.language);
    return generalResponse(req, res, { ...cities, ...countries, ...states }, null, false);
  });

  /**
   * get Logged in Api
  //  * @param {Request} req
  //  * @param {Response} res
  //  * @returns {Promise<void>}
   */

  // public getLanguages = catchAsync(async (req: Request, res: Response) => {
  //   const languages = await LanguageModel.findAll();
  //   return generalResponse(req, res, languages, 'LANGUAGE_FETCHED_SUCCESS');
  // });
  // /**
  //  * get Logged in Api
  //  * @param {Request} req
  //  * @param {Response} res
  //  * @returns {Promise<void>}
  //  */

  // public getDefaultLanguage = catchAsync(async (req: Request, res: Response) => {
  //   const languages = await LanguageModel.findOne({ where: { is_default: true } });
  //   return generalResponse(req, res, languages, 'LANGUAGE_FETCHED_SUCCESS');
  // });
}
