import { RoleEnum } from '../../../common/constants/enum.constant';
import BaseRepository from '../../common/base.repository';
import Role from '../../../models/role.model';

export default class RoleRepo extends BaseRepository<Role> {
  constructor() {
    super(Role.name);
  }

  readonly getRoleById = async (id: number) => {
    return await this.get({
      where: {
        id,
      },
    });
  };

  readonly getRoleByName = async (name: RoleEnum) => {
    return await this.get({
      where: {
        name,
      },
    });
  };
}
