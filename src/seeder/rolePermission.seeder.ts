import { toastMessageData } from '../common/constants/messages.constant';
import { rolePermissionData } from '../common/constants/seeder.constant';
import { logger } from '../common/util/logger';
import RolePermission from '../models/rolesPermissions.model';
import featureRepoImport from '../modules/feature/repository/feature.repository';
import permissionRepoImport from '../modules/permission/repository/permission.repository';
import roleRepoImport from '../modules/role/repository/role.repository';
import RolePermissionRepo from '../modules/rolePermission/repository/rolePermission.repository';
import _ from 'lodash';

const addPermissions = async () => {
  const toastData = toastMessageData();

  try {
    const featureMap = new Map();
    const permissionMap = new Map();
    const roleMap = new Map();
    const allPermissionData = [];
    const featureRepo = new featureRepoImport();
    const rolePermissionRepo = new RolePermissionRepo();
    const roleRepo = new roleRepoImport();
    const permissionRepo = new permissionRepoImport();

    for (const rolePermission of rolePermissionData) {
      if (!featureMap.has(rolePermission.featureName)) {
        const feature = await featureRepo.get({ attributes: ['id'], where: { name: rolePermission.featureName } });
        featureMap.set(rolePermission.featureName, feature.id);
      }

      if (!roleMap.has(rolePermission.role)) {
        const role = await roleRepo.get({ attributes: ['id'], where: { name: rolePermission.role } });
        roleMap.set(rolePermission.role, role.id);
      }

      for (const singlePermission of rolePermission.permission) {
        if (!permissionMap.has(singlePermission)) {
          const permission = await permissionRepo.get({
            attributes: ['id'],
            where: { name: singlePermission },
          });
          permissionMap.set(singlePermission, permission.id);
        }
      }

      for (const singlePermission of rolePermission.permission) {
        allPermissionData.push({
          role_id: roleMap.get(rolePermission.role),
          feature_id: featureMap.get(rolePermission.featureName),
          permission_id: permissionMap.get(singlePermission),
          role_permission_key: `${roleMap.get(rolePermission.role)}${featureMap.get(
            rolePermission.featureName,
          )}${permissionMap.get(singlePermission)}`,
          access: rolePermission?.access || '',
        });
      }
    }

    let allExistingPermission = await rolePermissionRepo.getAll({
      attributes: ['role_id', 'permission_id', 'feature_id'],
    });

    allExistingPermission = allPermissionData.filter(
      (allData) =>
        !allExistingPermission.find(
          (dbData) =>
            dbData.role_id == allData.role_id &&
            dbData.feature_id == allData.feature_id &&
            dbData.permission_id == allData.permission_id,
        ),
    );

    if (allExistingPermission?.length > 0) {
      for (const createData of allExistingPermission) {        
        const foundedData = await rolePermissionRepo.get({ where: { ...createData } });
        if (_.isNull(foundedData)) {
          await RolePermission.create(createData);
        }
      }
    }
  } catch (error) {
    logger.error(toastData.SOMETHING_WRONG, error);
  }
};

addPermissions();
