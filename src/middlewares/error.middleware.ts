import { generalResponse } from '../common/helper/response/generalResponse';
import { logger } from '../common/util/logger';
import { HttpException } from '../common/helper/response/httpException';
import { JsonKeys } from '../common/interfaces/general/general.interface';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { DatabaseError } from 'sequelize';

const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error instanceof HttpException) {
      const data = error.data || {};
      const status: number = error.status || 500;
      const message: JsonKeys = (error.message as JsonKeys) || 'SOMETHING_WRONG';
      return generalResponse(req, res, data, message, true, 'error', status);
    }
    if (axios.isAxiosError(error)) {
      // axios Error
      return generalResponse(
        req,
        res,
        {
          code: error.code,
          detailError: error.response?.data,
        },
        'SOMETHING_WRONG',
        false,
        'error',
        error.response?.status || 500,
      );
    }

    if (error instanceof DatabaseError) {
      return generalResponse(req, res, error.message ? error?.message : error, 'SOMETHING_WRONG', false, 'error', 500);
    }

    return generalResponse(req, res, error.stack, 'SOMETHING_WRONG', false, 'error', 500);
  } catch (err) {
    next(err);
  }
  return true;
};

//if the Promise is rejected this will catch it
process.on('unhandledRejection', (error) => {
  logger.log('info', 'Unhandled Rejection', error);
  const req: Request = global.currentRequest;
  const res: Response = global.currentResponse;
  if (req?.transaction) {
    req?.transaction?.rollback();
  }
  // res.status(200).send('Something went wrong ');
  // process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.log('info', 'Uncaught Exception', error);
  const req: Request = global.currentRequest;
  const res: Response = global.currentResponse;
  if (req?.transaction) {
    req?.transaction?.rollback();
  }
  // res.status(200).send('Something went wrong ');

  // process.exit(1);
});

export default errorMiddleware;
