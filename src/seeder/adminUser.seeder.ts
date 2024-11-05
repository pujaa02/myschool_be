import { ARGON_SALT_LENGTH } from '../config/index';
import { RoleEnum, Super } from '../common/constants/enum.constant';
// import { LanguageEnum } from '../common/interfaces/general/general.interface';
import { logger } from '../common/util/logger';
import { USER_STATUS } from '../models/interfaces/user.model.interface';
import RoleRepo from '../modules/role/repository/role.repository';
import UserRepo from '../modules/user/repository/user.repository';
import argon2 from 'argon2';

// const adminUser: UserAttributes = {
//   email: Super.EMAIL,
//   first_name: Super.FIRST_NAME,
//   last_name: Super.LAST_NAME,
//   username: Super.USERNAME,
//   password: Super.PASSWORD,
//   active: USER_STATUS.ACTIVE,
//   verified: true,
//   // language: LanguageEnum.English,
// };

const addAdminUser = async () => {
  const password = await argon2.hash(Super.PASSWORD, { saltLength: +ARGON_SALT_LENGTH });
  const existingAdmin = await new UserRepo().get({
    where: { email: Super.EMAIL, username: Super.USERNAME },
  });
  if (existingAdmin) {
    logger.info('Admin User already exists');
    return;
  }
  const roleId = await new RoleRepo().get({ attributes: ['id'], where: { name: RoleEnum.Admin } });
  // adminUser['role_id'] = roleId.id;
  // await new UserRepo().create(adminUser);
  await new UserRepo().create({
    email: Super.EMAIL,
    first_name: Super.FIRST_NAME,
    last_name: Super.LAST_NAME,
    username: Super.USERNAME,
    password: password,
    active: USER_STATUS.ACTIVE,
    verified: true,
    role_id: roleId.id,
    // language: LanguageEnum.English,
  });
};

addAdminUser()
  .then(() => logger.info('Admin Created Successfully !!'))
  .catch((err) => logger.info('ERROR %o', err));
