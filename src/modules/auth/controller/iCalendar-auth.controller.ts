import { TokenProvider } from '@/common/constants/socialAccount.constant';
import { fromBase64, objectToQueryParamString } from '@/common/utils';
import UserSocialAccountRepo from '@/modules/user/repository/userSocialAccount.repository';
import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import { NextFunction, Request, Response } from 'express';
import { State } from '../../strategies/interfaces/strategy.interface';

export class ICalendarAuth {
  private static readonly userSocialAccountRepository = new UserSocialAccountRepo();
  constructor() {}

  static readonly iCalendarAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;
      const tokenData: State = token && fromBase64(token as string);

      const user = await User.findOne({
        where: {
          active: USER_STATUS.ACTIVE,
          id: tokenData.userId,
        },
      });

      const userTokenData = {
        token_provider: TokenProvider.ICALENDAR,
        token_provider_mail: user.email,
        user_id: user.id,
        expires_in: 90 * 24 * 3600,
        token_provider_user_id: '',
        token_internal_date: undefined,
        // allowed_scopes: [],
        // requested_scopes: [],
        refresh_expires_in: 90 * 24 * 3600,
        token_type: '',
        access_token: '',
        refresh_token: '',
      };

      let existToken = await this.userSocialAccountRepository.checkTokenExist(userTokenData);
      if (existToken) {
        await this.userSocialAccountRepository.updateSocial({ data: userTokenData, existData: existToken });
      } else {
        existToken = await this.userSocialAccountRepository.createUserSocial(userTokenData);
      }

      return res.redirect(`${tokenData.successURL}?${objectToQueryParamString({ tokenProvider: TokenProvider.ICALENDAR })}`);
    } catch (err) {
      next(err);
    }
  };
}
