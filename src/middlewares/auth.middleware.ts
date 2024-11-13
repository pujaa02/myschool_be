import { generalResponse } from '../common/helper/response/generalResponse';
import { HttpException } from '../common/helper/response/httpException';
import { catchAsync } from '../common/util';
import { USER_STATUS } from '../models/interfaces/user.model.interface';
import User from '../models/user.model';
import UserRepo from '../modules/user/repository/user.repository';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import passport from 'passport';
import { Sequelize } from 'sequelize';

// By Pass Url
const byPassUrls = ['test'];

const checkInclude = (req) => {
  return byPassUrls.find((a) => req.url.includes(a));
};

const authMiddleware = catchAsync((req: Request, res: Response, next: NextFunction) => {
  try {
    if (checkInclude(req) && _.isUndefined(req.headers['authorization'])) {
      next();
    } else {
      passport.authenticate('jwt', async (err: Error, user: User) => {
        try {
          if (err || !user) {
            throw new HttpException(401, 'INVALID_TOKEN', true);
          }

          if (checkInclude(req)) {
            if (user) await setUserData(req, user, next);
            next();
          } else {
            await setUserData(req, user, next);
            return next();
          }
        } catch (error) {
          return generalResponse(res, error.message || error, 'UNAUTHORIZED_ERROR');
        }
      })(req, res, next);
    }
  } catch (error) {
    throw new HttpException(401, 'INVALID_TOKEN', true);
  }
});

const setUserData = async (req: Request, user: User, _next: NextFunction) => {
  try {
    const byPassVerifications = ['set-password', 'getLoggedIn'];
    const userRepo = new UserRepo();
    // const defaultLanguage = (await LanguageModel.findOne({ where: { is_default: true } })).name;
    const userData = await userRepo.get({
      where: {
        id: user.id,
      },
      attributes: [
        [Sequelize.col('role.name'), 'role_name'],
        'id',
        'email',
        'full_name',
        'first_name',
        'last_name',
        'username',
        'contact',
        'profile_image',
        'added_by',
        'date_format',
        'timezone',
        'birth_date',
        'gender',
        'address1',
        'address2',
        'city',
        'country',
        'state',
        'zip',
        'active',
        'verified',
        'created_at',
        'updated_at',
        'role_id',
        // 'is_head',
      ],
      // raw: true,
    });
    if (user.active !== USER_STATUS.ACTIVE) {
      throw new HttpException(400, 'LOGIN_RESTRICTED');
    }

    if (user && !user?.verified && !byPassVerifications.find((a) => req.url.includes(a)))
      throw new HttpException(401, 'INVALID_TOKEN');
    //  req.tokenData = userData as TokenDataInterface,
  } catch (error) {
    throw new HttpException(401, 'UNAUTHORIZED_ERROR');
  }
};

export default authMiddleware;
