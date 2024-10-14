import { toastMessageData } from '@/common/constants/messages.constants';
import { HttpException } from '@/common/helpers/response/httpException';
import { generateFourDigitNumber, parse } from '@/common/utils';
import BaseRepository from '@/modules/common/base.repository';
import SendMailRepo from '@/modules/common/sendMail.repository';
import UserRepo from '@/modules/user/repository/user.repository';
import OTP from '@/sequelizeDir/models/otp.model';
import { type } from '@/sequelizeDir/models/types/otp.model.interface';
import User from '@/sequelizeDir/models/user.model';
import { USER_STATUS } from '@sequelizeDir/models/types/user.model.type';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import moment from 'moment';
import {
  ChangePasswordInterface,
  OtpUpdateInterface,
  OtpVerificationInterface,
  SendOtpInterface,
  SetPasswordInterface,
} from '../interfaces/auth.interfaces';
import AuthRepo from './auth.repository';

export default class OtpRepo extends BaseRepository<OTP> {
  private readonly userRepo = new UserRepo();
  private readonly sendMailRepo = new SendMailRepo();
  private readonly toastData = toastMessageData();
  private readonly otpVerifier = {
    verified: true,
    active: USER_STATUS.ACTIVE,
  };

  constructor() {
    super(OTP.name);
  }

  otpVerification = async (data: OtpVerificationInterface) => {
    const authRepo = new AuthRepo();
    const user = await this.userRepo.getData({
      email: data.email,
    });
    const otpData = await this.checkOtpData({ typeData: data.type, email: data.email });
    await this.checkOtpExpired(otpData, data.otp);
    await this.deleteOtpData(user, otpData);
    return { verified: true, access_token: authRepo.createToken(user, false, '15min') };
  };

  setPassword = async (data: SetPasswordInterface) => {
    if (data.user.verified) await this.otpUpdateData(data);
    else throw new HttpException(400, 'ISNT_OTP_VERIFIED');
    const user = await this.userRepo.getData({ id: data.user.id });
    await user.update({ password: data.password, verified: true }, { ignoreValidation: true } as unknown);
    return { verified: true };
  };

  changePassword = async (data: ChangePasswordInterface) => {
    const { oldPassword, newPassword, user } = data;
    const getUser = await this.userRepo.DBModel.scope('withPassword').findOne({ where: { id: user.id } });
    if (getUser?.password) {
      const isMatch = await bcrypt.compare(oldPassword, parse(getUser).password);
      if (isMatch) {
        await getUser.update({ password: newPassword });
        return true;
      }
      throw new HttpException(400, 'OLD_PASSWORD', {}, true);
    } else throw new HttpException(400, 'USER_NOT_FOUND');
  };

  readonly checkOtpData = async ({ typeData, email }: { typeData: type; email: string }) => {
    const otpData = await this.get({
      where: { type: typeData, email },
      order: [['updatedAt', 'DESC']],
    });
    if (_.isEmpty(otpData)) throw new HttpException(400, 'OTP_EXPIRED');
    return otpData;
  };

  deleteOtpData = async (user: User, otpData: OTP) => {
    await this.userRepo.updateUserData(user, this.otpVerifier);
    await OTP.update({ deletedAt: new Date() }, { where: { id: otpData.id } });
  };

  otpUpdateData = async (data: OtpUpdateInterface) => {
    await OTP.update({ deletedAt: new Date(), ...(data.type ? { type: data.type } : {}) }, { where: { email: data.user.email } });
  };

  readonly checkOtpExpired = async (otpData: OTP, otp: string) => {
    const expiredTime = moment(otpData?.expired)
      .utc()
      .format();

    const currentTime = moment().utc().format();
    if (!moment(currentTime).isSameOrBefore(expiredTime)) throw new HttpException(400, 'OTP_EXPIRED');
    if (otpData && otpData?.otp !== parseInt(otp)) throw new HttpException(400, 'OTP_MISMATCHED');
  };

  //============== RESEND OTP SERVICE ================
  async sendOTP(data: SendOtpInterface) {
    const user = await this.userRepo.get({ where: { email: data.email } });
    if (_.isEmpty(user)) throw new HttpException(400, 'USER_NOT_FOUND');
    if (data.type === type.REGISTER) if (!user) throw new HttpException(400, 'REGISTER_OTP_ALREADY_EXIST');

    await this.otpUpdateData({
      user,
      type: data.type,
    });

    const otp = await this.createOtp(data);

    await this.sendMailRepo.sendMailForOtpVerification(user, data.type, {
      username: user.full_name,
      otp,
      text: this.toastData.OTP_SENT_SUCCESSFULLY + otp,
    });
  }

  createOtp = async (data: SendOtpInterface) => {
    const otp = generateFourDigitNumber();
    await OTP.create({
      email: data.email,
      otp: Number(otp),
      expired: moment.utc().add(900, 'second').format(),
      ...(data.type ? { type: data.type } : {}),
    });
    return otp;
  };
}
