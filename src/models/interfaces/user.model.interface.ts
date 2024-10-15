import { LanguageEnum } from '@/common/interfaces/general/general.interface';
import { RequiredKey } from './common.model.interface';
export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const DATE_FORMAT = 'MM/dd/yyyy';

export interface UserAttributes {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  is_head?: boolean;
  username?: string;
  contact?: string;
  profile_image?: string;
  password?: string;
  added_by?: number;
  date_format?: string;
  timezone?: string;
  birth_date?: Date | string;
  gender?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: number;
  secret_2fa?: string;
  two_factor_enabled?: boolean;
  country?: number;
  zip?: string;
  active?: USER_STATUS;
  verified?: boolean;
  last_login_time?: Date | string;
  role_id?: number;
  pass_logs?: string;
  last_active_time?: Date | string;
  parent_table_id?: number;
  language?: LanguageEnum;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredUserAttributes = RequiredKey<UserAttributes, 'email'>;
