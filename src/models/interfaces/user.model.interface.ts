import { RequiredKey } from './common.interface';
export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const DATE_FORMAT = 'MM/dd/yyyy';

export interface UserAttributes {
  id?: number;
  email: string;
  phone?: string;
  password: string;
  timezone?: string;
  birth_date?: Date | string;
  gender?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state_id?: number;
  country_id?: number;
  active?: USER_STATUS;
  verified?: boolean;
  mobile?: string;
  profile_image?: string;
  zip?: string;
  added_by?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
}

export type RequiredUserAttributes = RequiredKey<UserAttributes, 'email'>;
