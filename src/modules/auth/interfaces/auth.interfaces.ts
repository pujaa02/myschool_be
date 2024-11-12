import { UserAttributes } from '@/models/interfaces/user.model.interface';
import User from '@/models/user.model';

export enum type {
  FORGOT = 'FORGOT',
  REGISTER = 'REGISTER',
}

export interface LoginInterface {
  email: string;
  password: string;
  is_remember?: boolean;
}

export interface OtpVerificationInterface {
  email: string;
  otp: string;
  type: type;
}

export interface SetPasswordInterface {
  password: string;
  user: User | UserAttributes;
  type?: type;
}

export interface OtpUpdateInterface {
  user: User | UserAttributes;
  type?: type;
}

export interface ChangePasswordInterface {
  oldPassword: string;
  newPassword: string;
  user: User;
}

export interface RoleData {
  role_id: number;
  organizationUUID: string;
  is_system: boolean;
}

export type UserType = User & { role_name: string };
export type TokenDataInterface = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email: string;
  verified?: boolean;
  organization_id: number;
  organization_uuid: string;
  orgOwnerId: number;
  timezone: string;
  date_format: string;
  pass_updated_date: Date | string;
  two_factor_enabled: boolean;
  two_factor_verified: boolean;
  secret_2fa?: string;
  role?: RoleData; // current organization roleId and is_system flag
};
export type ExamTokenInfoInterface = {
  userId: number;
  examId: number;
  trainer_slug?: string;
};

export interface SendOtpInterface {
  email: string;
  type: type;
}

export interface AuthRegisterReqInterface {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
  birth_date: Date;
  user_role: number;
}
