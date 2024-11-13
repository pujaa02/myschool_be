import Role from '../models/role.model';
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
    // const userRepository = new UserRepo();
    const userData: any = await User.findOne({
      where: { id: user.id },
      include: [
        {
          model: Role,
        },
      ],
      rejectOnEmpty: false,
    });
    if (user.active !== USER_STATUS.ACTIVE) {
      throw new HttpException(400, 'LOGIN_RESTRICTED');
    }

    if (user && !user?.verified) throw new HttpException(401, 'INVALID_TOKEN');
    req.tokenData = {
      id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      email: userData.email,
      verified: userData.verified,
      timezone: userData.timezone,
      date_format: userData?.date_format || 'MM/dd/yyyy',
      role: userData.role,
    };
  } catch (error) {
    throw new HttpException(401, 'UNAUTHORIZED_ERROR');
  }
};

export default authMiddleware;
