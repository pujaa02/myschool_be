import { PermissionEnum } from '../common/constants/enum.constant';
import { logger } from '../common/util/logger';
import PermissionRepo from '../modules/permission/repository/permission.repository';

const addPermissions = async () => {
  try {
    const permissionRepository = new PermissionRepo();
    const allPermissions = [];
    const keys = Object.keys(PermissionEnum);
    let allExistingPermission: any = await permissionRepository.getAll({ attributes: ['name'] });
    allExistingPermission = allExistingPermission.map((data) => data.name);
    allExistingPermission = keys.filter((data) => !allExistingPermission.includes(data));
    for (const key of allExistingPermission) {
      allPermissions.push({
        name: PermissionEnum[key],
      });
    }
    if (allPermissions?.length > 0) {
      await permissionRepository.bulkCreate(allPermissions, {
        ignoreDuplicates: true,
      });
    }
    logger.info('Permissions Inserted Successfully !!');
  } catch (error) {
    logger.error('Something Went Wrong !!', error);
  }
};

addPermissions();
