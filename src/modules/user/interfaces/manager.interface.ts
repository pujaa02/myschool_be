import { RoleEnum } from '@/common/constants/enum.constants';
import { TokenDataInterface } from '@/modules/auth/interfaces/auth.interfaces';
import Manager from '@/sequelizeDir/models/manager.model';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import { BuildUserResp } from './user.interfaces';

export interface BuildManagerArgs {
  data: Request['body'];
  user?: BuildUserResp;
  transaction: Transaction;
  tokenData: TokenDataInterface;
}

export interface BuildManagerResp {
  managerIdLangMap: {
    [key: string]: number;
  };
}

export interface UpdateManagerArgs {
  data: Request['body'] | ManagerUpdateReqInterface['managerUserAdditionalDetails'];
  manager: Manager;
  transaction?: Transaction;
  tokenData: TokenDataInterface;
}

export interface ManagerCreateReqInterface {
  managerUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    role: RoleEnum;
  };
  managerUserAdditionalDetails: {
    job_title: string;
  };
}

export interface ManagerUpdateReqInterface {
  managerUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    role: RoleEnum;
  };
  managerUserAdditionalDetails: {
    job_title: string;
  };
  companyAdditionalDetails: {
    id?: number;
    name?: string;
    legal_name?: string;
    registration_number?: string;
    website?: string;
    industry?: string;
    description?: string;
    size?: string;

    address_l1?: string;
    address_l2?: string;
    address_city?: string;
    address_country?: string;
    address_zip?: string;

    ateco_code?: string;

    accounting_emails?: string;

    sdi_code?: string;

    vat_number?: string;
  };
}
