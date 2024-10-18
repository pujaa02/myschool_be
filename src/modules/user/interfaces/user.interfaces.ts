import User from '@/models/user.model';
import { TokenDataInterface } from '@/modules/auth/interfaces/auth.interfaces';
import { Request } from 'express';
import { Transaction } from 'sequelize';

export interface BuildUserArgs {
  data: Request['body'];
  tokenData: TokenDataInterface;
  user?: User;
  transaction: Transaction;
  shouldSentMail?: boolean;
  files?:
    | Express.Multer.File[]
    | {
        [fieldname: string]: Express.Multer.File[];
      };
}

export interface BuildUserResp {
  // userIdLangMap: {
  //   [key: string]: number;
  // };
  userdata: any;
}

export interface BulkUploadBody {
  role: number;
  is_admin_bulk_upload?: boolean;
  users: {
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    username?: string;
    active: string;
    role?: number;
    is_head?: boolean;
    password?: string;
    trainer?: {
      hourly_rate: number;
      travel_reimbursement_fee: number;
      location: string;
      rate_by_admin?: number;
      latitude?: string;
      longitude?: string;
    };
    privateIndividual?: {
      job_title: string;
      codice_fiscale: string;
    };
    manager?: {
      job_title: string;
      companies: number[];
    };
  }[];
}

export interface UserRelationalDataMap {
  [key: string]: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
      contact: string;
      active: string;
      role: number;
      is_head?: boolean;
    };
    trainer?: {
      hourly_rate?: number;
      travel_reimbursement_fee?: number;
      location?: string;
      rate_by_admin?: number;
      latitude?: string;
      longitude?: string;
    };
    privateIndividual?: {
      job_title?: string;
      codice_fiscale?: string;
    };
    manager?: {
      job_title?: string;
      companies: number[];
    };
  };
}

export interface BuildBulkUserArgs {
  data: BulkUploadBody;
  tokenData: TokenDataInterface;
  user?: User;
  transaction: Transaction;
  shouldSentMail?: boolean;
  is_bulk_upload_mail?: boolean;
}
