import { singleton } from '../../../decorators/singleton.decorator';
import UserOrganization from '../../../models/userOrganization.model';
import BaseRepository from '../../../modules/common/base.repository';

@singleton
export default class UserOrganizationRepo extends BaseRepository<UserOrganization> {
  constructor() {
    super(UserOrganization.name);
  }
}
