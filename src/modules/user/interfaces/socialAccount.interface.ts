import { TokenProvider, TokenProviderType } from '@/common/constants/socialAccount.constant';
import UserSocialAccount from '@/sequelizeDir/models/userSocialAccount.model';
import { Transaction } from 'sequelize';

export interface UpdateSocialArgs {
  data: UpsertTokenData;
  existData: UserSocialAccount;
  transaction?: Transaction;
}

export interface UpdateSocialProviderEntityIdArgs {
  entityId: string;
  existData: UserSocialAccount;
  transaction?: Transaction;
}

export interface ChangeActiveStatus {
  email: string;
  token_provider: TokenProviderType;
  is_active: boolean;
}

export interface ExistTokenArgs {
  readonly user_id: number;
  readonly token_provider: TokenProvider;
  readonly token_provider_mail: string;
}

export interface UpsertTokenData {
  user_id: number;
  token_provider_user_id: string;
  token_provider_mail: string;
  token_internal_date: Date;
  allowed_scopes?: string[];
  requested_scopes?: string[];
  token_provider: TokenProvider;
  refresh_expires_in: number;
  token_type: string;
  refresh_token?: string;
  access_token: string;
  expires_in: number;
  other_details?: any;
}
