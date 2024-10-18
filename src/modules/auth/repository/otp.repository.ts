import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { ChangePasswordInterface, SetPasswordInterface } from '../interfaces/auth.interfaces';
import { HttpException } from '@/common/helper/response/httpException';
import UserRepo from '@/modules/user/repository/user.repository';
import { parse } from '@/common/util';

export default class OtpRepo {
  private readonly userRepo = new UserRepo();

  constructor() {
    //
  }

  setPassword = async (data: SetPasswordInterface) => {
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
}
