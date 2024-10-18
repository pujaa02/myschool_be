import { RoleEnum } from '@/common/constants/enum.constant';
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

export type UserType = User & { role_name: string };
export type TokenDataInterface = {
  user: UserType;
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
  companyUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    role: RoleEnum;
  };
  companyUserAdditionDetails: {
    name: string;
    legal_name: string;
    registration_number: string;
    website: string;
    industry: string;
    description: string;
    size: string;
    accounting_emails: JSON;
    ateco_code: string;
    sdi_code: string;
    vat_number: string;
    is_invoice: boolean;
    files:
      | Express.Multer.File[]
      | {
          [fieldname: string]: Express.Multer.File[];
        };
  };
  managerUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    role: RoleEnum;
  };
  managerUserAdditionalDetails: {
    job_title: string;
    billing_address1: string;
    billing_address2: string;
    billing_city: string;
    billing_state: string;
    billing_country: string;
    billing_zip: string;
  };
}
