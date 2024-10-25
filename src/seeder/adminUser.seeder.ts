import { RoleEnum } from '../common/constants/enum.constant';
// import { LanguageEnum } from '../common/interfaces/general/general.interface';
import { logger } from '../common/util/logger';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config';
import { USER_STATUS, UserAttributes } from '../models/interfaces/user.model.interface';
import RoleRepo from '../modules/role/repository/role.repository';
import UserRepo from '../modules/user/repository/user.repository';

const adminUser: UserAttributes = {
  email: ADMIN_EMAIL,
  first_name: 'MySchool',
  last_name: 'Admin',
  username: 'myschool@admin',
  password: ADMIN_PASSWORD,
  active: USER_STATUS.ACTIVE,
  verified: true,
  // language: LanguageEnum.English,
};

const addAdminUser = async () => {
  const existingAdmin = await new UserRepo().get({
    where: { email: ADMIN_EMAIL, username: 'myschool@admin' },
  });
  if (existingAdmin) {
    logger.info('Admin User already exists');
    return;
  }
  const roleId = await new RoleRepo().get({ attributes: ['id'], where: { name: RoleEnum.Admin } });
  adminUser['role_id'] = roleId.id;
  await new UserRepo().create(adminUser);
};

addAdminUser()
  .then(() => logger.info('Admin Created Successfully !!'))
  .catch((err) => logger.info('ERROR %o', err));
