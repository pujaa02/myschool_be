import { RoleEnum } from '@/common/constants/enum.constants';
import { CompanyCreateReqInterface, CreateCompanyResp } from '@/modules/company/interfaces/company.interface';
import Company from '@/sequelizeDir/models/company.model';
import { type } from '@/sequelizeDir/models/types/otp.model.interface';
import User from '@/sequelizeDir/models/user.model';
import { UserAttributesType } from '@sequelizeDir/models/types/user.model.type';
import { Transaction } from 'sequelize';

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
  user: User | UserAttributesType;
  type?: type;
}

export interface OtpUpdateInterface {
  user: User | UserAttributesType;
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

export interface AuthRegisterPrivateIndividualReqInterface {
  privateIndividualUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    role: RoleEnum;
  };
  privateIndividualUserAdditionalDetails: {
    job_title: string;
    codice_fiscale: string;
  };
}

export interface ManageCompanyCreationInterface {
  companyUserDetails: AuthRegisterReqInterface['companyUserDetails'] | CompanyCreateReqInterface['companyUserDetails'];
  companyUserAdditionDetails:
    | AuthRegisterReqInterface['companyUserAdditionDetails']
    | CompanyCreateReqInterface['companyUserAdditionDetails'];
  transaction: Transaction;
  tokenData: TokenDataInterface;
}
export interface ManageManagerCreationInterface {
  managerUserDetails: AuthRegisterReqInterface['managerUserDetails'] | CompanyCreateReqInterface['managerUserDetails'];
  managerUserAdditionalDetails:
    | AuthRegisterReqInterface['managerUserAdditionalDetails']
    | CompanyCreateReqInterface['managerUserAdditionalDetails'];
  transaction: Transaction;
  tokenData: TokenDataInterface;
  company: CreateCompanyResp;
}

export interface ManagePrivateIndividualCreationInterface {
  privateIndividualUserDetails: AuthRegisterPrivateIndividualReqInterface['privateIndividualUserDetails'];
  privateIndividualUserAdditionalDetails: AuthRegisterPrivateIndividualReqInterface['privateIndividualUserAdditionalDetails'];
  transaction: Transaction;
  tokenData: TokenDataInterface;
}

export interface ManageManagerWithMultiCompanyCreationInterface {
  managerUserDetails: AuthRegisterReqInterface['managerUserDetails'] | CompanyCreateReqInterface['managerUserDetails'];
  managerUserAdditionalDetails:
    | AuthRegisterReqInterface['managerUserAdditionalDetails']
    | CompanyCreateReqInterface['managerUserAdditionalDetails'];
  transaction: Transaction;
  tokenData: TokenDataInterface;
  companies: Company[];
}
