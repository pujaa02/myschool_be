import { RoleEnum } from '@/common/constants/enum.constants';
import { HttpException } from '@/common/helpers/response/httpException';
import { generateSlugifyForModel } from '@/common/utils';
import BaseRepository from '@/modules/common/base.repository';
import Role from '@/sequelizeDir/models/role.model';
import SystemLogs from '@/sequelizeDir/models/systemLogs.model';
import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import { Request } from 'express';
import { Transaction } from 'sequelize';

export default class LogRepo extends BaseRepository<SystemLogs> {
  constructor() {
    super(SystemLogs.name);
  }
  /**
   * create Log
   * @param { name: string } data
   * @returns {Promise<SystemLogs>}
   */

  readonly createLog = async (data, req?: Request, transaction?: Transaction): Promise<SystemLogs> => {
    const slug = await generateSlugifyForModel('log', SystemLogs);
    const user = await User.findOne({
      attributes: ['id'],
      include: [
        {
          model: Role,
          where: { name: RoleEnum.Admin },
          required: true,
        },
      ],
      where: {
        active: USER_STATUS.ACTIVE,
      },
    });
    const payload = {
      title: data.title,
      description: data.description,
      module_id: data.module_id,
      feature_id: data.feature_id,
      slug,
      is_language_considered: data.is_language_considered,
      user_id: data.user_id || null,
      language: data.language,
      created_by: req?.tokenData ? req?.tokenData?.user?.id : user?.id,
      created_at: new Date(),
      permission_type: data.permission_type,
    };
    const dataData = await this.create(payload, { transaction: transaction });
    return dataData;
  };

  /**
   * Delete Log Details
   * @param { name: string } data
   * @returns {Promise<SystemLogs>}
   */
  readonly deleteLog = async (slug: string) => {
    const findDuplicateData: SystemLogs = await SystemLogs.findOne({
      where: { slug },
    });
    if (!findDuplicateData) throw new HttpException(400, 'LOG_NOT_FOUND');
    const result = await SystemLogs.destroy({
      where: {
        id: findDuplicateData.id,
      },
    });

    return result;
  };
}
