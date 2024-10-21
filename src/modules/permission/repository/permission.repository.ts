import Permission from '../../../models/permission.model';
import BaseRepository from '../../../modules/common/base.repository';

export default class PermissionRepo extends BaseRepository<Permission> {
  constructor() {
    super(Permission.name);
  }
}
