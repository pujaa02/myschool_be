import { RoleEnum } from '@/common/constants/enum.constants';
import { TokenDataInterface } from '@/modules/auth/interfaces/auth.interfaces';
import { User } from 'aws-sdk/clients/budgets';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import PrivateIndividual from '../../../sequelizeDir/models/privateIndividual.model';
import { BuildUserResp } from './user.interfaces';

export interface BuildPrivateIndividualArgs {
  data: Request['body'];
  user?: User;
  transaction: Transaction;
  buildUserResp: BuildUserResp;
}

export interface UpdatePrivateIndividualArgs {
  data: Request['body'] | PrivateIndividualUpdateReqInterface['privateIndividualUserAdditionalDetails'];
  privateIndividual: PrivateIndividual;
  transaction?: Transaction;
  tokenData: TokenDataInterface;
}

export interface PrivateIndividualCreateReqInterface {
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

export interface PrivateIndividualUpdateReqInterface {
  privateIndividualUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    role: RoleEnum;
  };
  privateIndividualUserAdditionalDetails: {
    job_title: string;
  };
}
