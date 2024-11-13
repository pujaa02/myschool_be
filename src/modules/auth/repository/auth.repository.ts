// import { Request } from 'express';
import jwt from 'jsonwebtoken';
import {
  AuthRegisterReqInterface,
  ChangePasswordInterface,
  LoginInterface,
  SetPasswordInterface,
  TokenDataInterface,
} from '../interfaces/auth.interfaces';
import { HttpException } from '../../../common/helper/response/httpException';
import { ARGON_SALT_LENGTH, SECRET_KEY } from '../../../config';
import { USER_STATUS } from '../../../models/interfaces/user.model.interface';
import Role from '../../../models/role.model';
import User from '../../../models/user.model';
import BaseRepository from '../../../modules/common/base.repository';
import UserRepo from '../../../modules/user/repository/user.repository';
import { RoleEnum } from '../../../common/constants/enum.constant';
import { parse } from '../../../common/util';
import OtpRepo from './otp.repository';
import * as argon2 from 'argon2';
// import { authRegisterReq } from '../normalizer/auth.normalizer';

export default class AuthRepo extends BaseRepository<User> {
  private readonly userRepository = new UserRepo();
  private readonly otpRepository = new OtpRepo();
  constructor() {
    super(User.name);
  }

  readonly createToken = (user: User, is_remember: boolean, time?: string) => {
    return jwt.sign({ email: user.email, userId: user.id }, SECRET_KEY, {
      expiresIn: is_remember ? '3d' : time ? time : '1d',
    });
  };

  public registerUser = async (data: AuthRegisterReqInterface) => {
    const { first_name, last_name, password, email, birth_date, user_role } = data;
    const argonPass = await argon2.hash(password, { saltLength: +ARGON_SALT_LENGTH });
    const result = await this.userRepository.create({
      email,
      first_name,
      last_name,
      username: `${first_name}@${last_name}`,
      password: argonPass,
      active: USER_STATUS.ACTIVE,
      verified: true,
      birth_date: new Date(birth_date),
      role_id: user_role,
    });
  };

  logout = async (reqUser: TokenDataInterface) => {
    await this.userRepository.update({ verified: false }, { where: { id: reqUser.id } });
  };

  public login = async (data: LoginInterface) => {
    const { email, is_remember } = data;
    const user: any = await this.userRepository.DBModel.scope('withPassword').findOne({
      where: { email },
      include: [
        {
          model: Role,
        },
      ],
      rejectOnEmpty: false,
    });
    if (user) {
      if (parse(user)?.role.name === RoleEnum.Admin) {
        await this.userRepository.update({ verified: true }, { where: { id: parse(user).id } });
      }
      if (user.active === USER_STATUS.INACTIVE) {
        throw new HttpException(400, 'USER_INACTIVE');
      }
      const passwordCheck = await this.checkPassword(data, user);
      if (passwordCheck) {
        return {
          user: {
            verified: user.verified,
            username: user.username,
            // secret_2fa: user.secret_2fa,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            email: user.email,
            contact: user.contact,
          },
          // access_token: this.createToken(user, is_remember),
        };
      }
    } else throw new HttpException(400, 'REGISTER_FIRST', null, true);
  };

  public checkPassword = async (data: LoginInterface, user: User) => {
    if (!user.password) throw new HttpException(400, 'PASSWORD_NOT_SET');
    let isMatch = false;
    const userPass = user.password;
    isMatch = await argon2.verify(userPass, data.password);
    if (isMatch) return true;
    else throw new HttpException(400, 'PASSWORD_ERROR', null, true);
  };

  async setPassword(data: SetPasswordInterface) {
    return this.otpRepository.setPassword(data);
  }

  changePassword = async (data: ChangePasswordInterface) => {
    await this.otpRepository.changePassword(data);
  };
}
