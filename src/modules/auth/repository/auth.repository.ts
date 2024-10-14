import { HttpException } from '@/common/helpers/response/httpException';
import { Bool, decrypt, encrypt, parse } from '@/common/utils';
import { BYPASS, FRONT_URL, SECRET_KEY } from '@/config';
import BaseRepository from '@/modules/common/base.repository';
import CompanyRepo from '@/modules/company/repository/company.repository';
import ManagerRepo from '@/modules/user/repository/manager.repository';
import PrivateIndividualRepo from '@/modules/user/repository/privateIndividual.repository';
import UserRepo from '@/modules/user/repository/user.repository';
import Role from '@/sequelizeDir/models/role.model';
import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import {
  ChangePasswordInterface,
  LoginInterface,
  OtpVerificationInterface,
  SendOtpInterface,
  SetPasswordInterface,
} from '../interfaces/auth.interfaces';
import { authRegisterPrivateIndividualReq, authRegisterReq } from '../normalizer/auth.normalizer';
import OtpRepo from './otp.repository';

export default class AuthRepo extends BaseRepository<User> {
  private readonly userRepository = new UserRepo();
  private readonly otpRepository = new OtpRepo();
  private readonly companyRepository = new CompanyRepo();
  private readonly managerRepository = new ManagerRepo();
  private readonly privateIndividualRepository = new PrivateIndividualRepo();

  constructor() {
    super(User.name);
  }

  readonly createToken = (user: User, is_remember: boolean, time?: string) => {
    return jwt.sign({ email: user.email, userId: user.id }, SECRET_KEY, { expiresIn: is_remember ? '3d' : time ? time : '1d' });
  };

  readonly registerUser = async (req: Request) => {
    const { tokenData, transaction } = req;

    const { companyUserDetails, companyUserAdditionDetails, managerUserDetails, managerUserAdditionalDetails } =
      authRegisterReq(req);

    // check company

    const company = await this.companyRepository.manageCompanyCreation({
      companyUserDetails,
      companyUserAdditionDetails,
      transaction,
      tokenData,
    });

    const managerUser = await this.managerRepository.manageManagerCreation({
      managerUserDetails,
      managerUserAdditionalDetails,
      transaction,
      tokenData,
      company,
    });
    // check manager

    return managerUser;
  };

  readonly registerPrivateIndividualUser = async (req: Request) => {
    const { tokenData, transaction } = req;

    const { privateIndividualUserAdditionalDetails, privateIndividualUserDetails } = authRegisterPrivateIndividualReq(req);

    const privateIndividualUser = await this.privateIndividualRepository.managePrivateIndividualCreation({
      privateIndividualUserAdditionalDetails,
      privateIndividualUserDetails,
      transaction,
      tokenData,
    });
    // check manager

    return privateIndividualUser;
  };

  setup2FAVerify = async (req: Request, body, reqUser: User) => {
    const { code, secret, is_remember } = body;
    const { id } = reqUser;
    const decodedSecret = decrypt(secret);
    let user = await this.userRepository.get({ where: { id }, transaction: req.transaction });
    if (!user.secret_2fa && !secret) {
      throw new HttpException(400, 'USER_SECRET_NOT_FOUND');
    }
    const authRepo = new AuthRepo();
    const access_token = authRepo.createToken(user, is_remember);

    // Check if the provided code is the bypass code
    if (code === '123456' && Bool(BYPASS)) {
      await this.userRepository.update(
        { secret_2fa: secret, two_factor_enabled: true, verified: true },
        { where: { id }, transaction: req.transaction },
      );
      user = await this.userRepository.get({ where: { id }, transaction: req.transaction });
      return { user, access_token };
    }
    const verified = speakeasy.totp.verify({
      secret: decodedSecret,
      encoding: 'base32',
      token: code,
    });
    if (verified) {
      await this.userRepository.update(
        { secret_2fa: secret, two_factor_enabled: true, verified: verified },
        { where: { id }, transaction: req.transaction },
      );
      user = await this.userRepository.get({ where: { id }, transaction: req.transaction });
      return { user, access_token };
    } else return { verified: false };
  };

  logout = async (reqUser: User) => {
    await this.userRepository.update({ verified: false }, { where: { id: reqUser.id } });
  };

  getTwoFactorAuthQR = async (req: Request) => {
    const { user: tokenUser } = req.tokenData;
    const { email, id: userId } = tokenUser;
    const secret = speakeasy.generateSecret({
      issuer: FRONT_URL,
      otpauth_url: true,
      name: `Pro leven App:${email}`,
    });
    const secret_2fa = secret.base32;
    const id = req.params.id ? +req.params.id : userId;
    const user = await this.userRepository.get({ where: { id }, attributes: ['id', 'secret_2fa'] });
    let QRCode: string;
    const secretData = encrypt(secret_2fa);
    if (!user?.secret_2fa) {
      QRCode = await qrcode.toDataURL(secret.otpauth_url);
    } else {
      await this.userRepository.update({ secret_2fa: secretData, two_factor_enabled: false, verified: false }, { where: { id } });
    }
    return QRCode ? { QRCode, secret: secretData, secretWithoutEncryption: secret.base32 } : {};
  };

  public login = async (data: LoginInterface) => {
    const { email, is_remember } = data;
    const user = await this.userRepository.DBModel.scope('withPassword').findOne({
      where: { email },
      include: [
        {
          model: Role,
        },
      ],
      rejectOnEmpty: false,
    });
    if (user) {
      // if (parse(user)?.role.name === RoleEnum.Admin) {
      //   await this.userRepository.update({ verified: true }, { where: { id: parse(user).id } });
      // }
      if (user.active === USER_STATUS.INACTIVE) {
        throw new HttpException(400, 'USER_INACTIVE');
      }
      const passwordCheck = await this.checkPassword(data, user);
      if (passwordCheck) {
        return {
          user: {
            verified: user.verified,
            username: user.username,
            secret_2fa: user.secret_2fa,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            email: user.email,
            contact: user.contact,
          },
          access_token: this.createToken(user, is_remember),
        };
      }
    } else throw new HttpException(400, 'REGISTER_FIRST', null, true);
  };

  public checkPassword = async (data: LoginInterface, user: User) => {
    if (!user.password) throw new HttpException(400, 'PASSWORD_NOT_SET');
    const isMatch = await bcrypt.compare(data.password, parse(user).password);
    if (isMatch) return true;
    else throw new HttpException(400, 'PASSWORD_ERROR', null, true);
  };

  async otpVerification(data: OtpVerificationInterface) {
    return await this.otpRepository.otpVerification(data);
  }

  async setPassword(data: SetPasswordInterface) {
    return this.otpRepository.setPassword(data);
  }

  async sendOTP(data: SendOtpInterface) {
    await this.otpRepository.sendOTP(data);
  }

  changePassword = async (data: ChangePasswordInterface) => {
    await this.otpRepository.changePassword(data);
  };
}
