import { TokenProvider } from '@/common/constants/socialAccount.constant';
import { FindOneArgs } from '@/common/interfaces/general/database.interface';
import BaseRepository, { getModel } from '@/modules/common/base.repository';
import UserSocialAccount from '@/sequelizeDir/models/userSocialAccount.model';
import { Optional, Transaction } from 'sequelize';
import {
  ChangeActiveStatus,
  ExistTokenArgs,
  UpdateSocialArgs,
  UpdateSocialProviderEntityIdArgs,
  UpsertTokenData,
} from '../interfaces/socialAccount.interface';

export default class UserSocialAccountRepo extends BaseRepository<UserSocialAccount> {
  constructor() {
    super(UserSocialAccount.name);
  }

  readonly upsertSocialAccount = async (data: UpsertTokenData) => {
    const { token_provider, token_provider_mail, user_id } = data;
    return this.upsert(
      { ...data },
      {
        conflictFields: ['token_provider', 'token_provider_mail', 'user_id'],
        conflictWhere: { token_provider, token_provider_mail, user_id, deleted_at: null },
        returning: true,
      },
    );
  };

  readonly checkTokenExist = async (data: ExistTokenArgs) => {
    const { token_provider, user_id, token_provider_mail } = data;
    let existData: UserSocialAccount;

    if (token_provider === TokenProvider.GOOGLE_CALENDAR || token_provider === TokenProvider.MICROSOFT_CALENDAR) {
      existData = await this.get({
        where: {
          user_id,
          token_provider: token_provider,
          token_provider_mail,
        },
      });
    } else {
      existData = await this.get({
        where: {
          user_id,
          token_provider,
          token_provider_mail,
        },
      });
    }

    return existData;
  };

  readonly createUserSocial = (data: UpsertTokenData, transaction?: Transaction) => {
    return this.create({ ...data, token_internal_date: new Date() }, { transaction });
  };

  readonly updateSocial = async (updateSocial: UpdateSocialArgs) => {
    const { data, existData, transaction } = updateSocial;
    return this.update({ ...data, token_internal_date: new Date() }, { where: { id: existData.id }, transaction }).then(
      ([, userToken]) => userToken?.[0],
    );
  };

  readonly changeActiveStatus = async (data: ChangeActiveStatus, transaction?: Transaction) => {
    const { email, token_provider, is_active } = data;

    return this.update({ is_active }, { where: { token_provider_mail: email, token_provider }, transaction }).then((resp) => {
      return resp[1]?.at(0);
    });
  };

  readonly updateProviderEntitySocial = async (data: UpdateSocialProviderEntityIdArgs) => {
    const { entityId, existData } = data;
    return await this.update({ token_provider_entity_id: entityId }, { where: { id: existData.id } });
  };

  readonly getSocialAccount = (data: Optional<FindOneArgs<UserSocialAccount>, 'rejectOnEmpty'>) => {
    return getModel<UserSocialAccount>(UserSocialAccount.name).findOne(data);
  };
}
