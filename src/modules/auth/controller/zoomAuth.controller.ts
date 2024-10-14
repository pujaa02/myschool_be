import { toastMessageData } from '@/common/constants/messages.constants';
import { TokenProvider } from '@/common/constants/socialAccount.constant';
import { HttpException } from '@/common/helpers/response/httpException';
import { objectToQueryParamString } from '@/common/utils';
import { logger } from '@/common/utils/logger';
import ZoomAuthService from '@/lib/zoom/zoom-auth.service';
import { NextFunction, Request, Response } from 'express';

export default abstract class ZoomAuth {
  private static readonly zoomAuthService = new ZoomAuthService();
  private static readonly toastData = toastMessageData();
  constructor() {
    // do nothing
  }

  static readonly connectZoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;
      const url = await this.zoomAuthService.getAuthorizeURL(token as string);
      return res.redirect(url);
    } catch (err) {
      next(err);
    }
  };

  static readonly authWithZoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.query;
      if (!state || state === 'undefined' || !code) {
        throw new HttpException(400, 'STATE_ERROR');
      }
      const tokenData = JSON.parse(Buffer.from(state as string, 'base64').toString());
      const checkedZoomData = await this.zoomAuthService.validateTokenData(tokenData);
      try {
        await this.zoomAuthService.getZoomAccessTokens({
          code: code as string,
          user_id: checkedZoomData.userId,
          type: 'initial',
          is_default: tokenData.is_default,
        });
        return res.redirect(`${checkedZoomData.successURL}?${objectToQueryParamString({ tokenProvider: TokenProvider.ZOOM })}`);
      } catch (err) {
        logger.info('ZOOM ERROR', err);
        return res.redirect(`${checkedZoomData.failureURL}?${objectToQueryParamString({ tokenProvider: TokenProvider.ZOOM })}`);
      }
    } catch (err) {
      next(err);
    }
  };
}
