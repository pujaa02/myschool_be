import { RoleEnum } from '@/common/constants/enum.constant';
import { toastMessageData } from '@/common/constants/messages.constant';
import { logger } from '@/utils/logger';

const addRoles = async () => {
  const toastData = toastMessageData();

  try {
    const allRoles = [];
    const roleRepo = new roleRepository();
    const keys = Object.keys(RoleEnum);
    let allExistingRole: any = await roleRepo.getAll({ attributes: ['name'] });
    allExistingRole = allExistingRole.map((data) => data.name);
    allExistingRole = keys.filter((data) => !allExistingRole.includes(data));
    for (const key of allExistingRole) {
      allRoles.push({
        name: RoleEnum[key],
      });
    }
    if (allRoles?.length > 0) {
      await roleRepo.bulkCreate(allRoles, {
        ignoreDuplicates: true,
      });
    }
    logger.info(toastData.ROLE_CREATED);
  } catch (error) {
    logger.error(toastData.SOMETHING_WRONG, error);
  }
};

addRoles();
