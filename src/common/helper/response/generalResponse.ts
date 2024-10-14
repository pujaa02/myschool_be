import { Request, Response } from 'express';
import * as fs from 'fs';

export const t = (req: Request, message: JsonKeys) => {
  const languageData = setHeader(req);
  const fileData = fs.readFileSync(`${process.cwd()}/src/common/translations/${languageData}.json`, 'utf-8');
  const jsonData = JSON.parse(fileData);
  return jsonData[message];
};

export const setHeader = (req: Request) => {
  const languageData = req.headers['accept-language'] as language;
  if (!Object.values(language).includes(languageData)) return language.en;

  return languageData;
};

export const generalResponse = async (
  request: Request,
  response: Response,
  data: any = null,
  message: JsonKeys,
  toast = false,
  responseType = 'success',
  statusCode = 200,
) => {
  message = t(request, message);

  if (request.transaction) {
    if (responseType === 'success') await request.transaction.commit();
    else await request.transaction.rollback();
  }

  response.status(statusCode).send({
    data,
    message,
    toast,
    responseType,
  });
};
