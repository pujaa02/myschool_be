import { RoleEnum } from '@/common/constants/enum.constants';
import { TokenDataInterface } from '@/modules/auth/interfaces/auth.interfaces';
import Trainer from '@/sequelizeDir/models/trainer.model';
import { Transaction } from 'sequelize';
import { BuildUserResp } from './user.interfaces';

export interface BuildTrainerArgs {
  data: TrainerCreateReqInterface['trainerUserAdditionalDetails'];
  user?: BuildUserResp;
  transaction: Transaction;
  tokenData: TokenDataInterface;
  files?:
    | Express.Multer.File[]
    | {
        [fieldname: string]: Express.Multer.File[];
      };
}

export interface BuildTrainerResp {
  trainerIdLangMap: {
    [key: string]: number;
  };
}

export interface UpdateTrainerArgs {
  data: TrainerUpdateReqInterface['trainerUserAdditionalDetails'];
  trainer: Trainer;
  transaction?: Transaction;
  tokenData: TokenDataInterface;
  files:
    | Express.Multer.File[]
    | {
        [fieldname: string]: Express.Multer.File[];
      };
}

export interface TrainerCreateReqInterface {
  trainerUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    role: RoleEnum;
  };
  trainerUserAdditionalDetails: {
    hourly_rate: number;
    travel_reimbursement_fee: number;
    location: string;
    rate_by_admin?: number;
    trainer_attachment?: string[];
    latitude?: string;
    longitude?: string;
  };
}

export interface TrainerUpdateReqInterface {
  trainerUserDetails: {
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    role: RoleEnum;
  };
  trainerUserAdditionalDetails: {
    hourly_rate: number;
    travel_reimbursement_fee: number;
    rate_by_admin?: number;
    location: string;
    longitude: string;
    latitude: string;
    subCategories: number[];
    trainer_attachment?: string[];
  };
}
