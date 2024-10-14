import BaseRepository from '@/modules/common/base.repository';
import Permission from '@/sequelizeDir/models/permission.model';

export default class PermissionRepo extends BaseRepository<Permission> {
  constructor() {
    super(Permission.name);
  }
}
