import { TokenDataInterface } from '@/modules/auth/interfaces/auth.interfaces';
import { Transaction } from 'sequelize';
import { BuildUserResp } from './user.interfaces';

export interface BuildSalesRepArgs {
  user?: BuildUserResp;
  transaction: Transaction;
  tokenData: TokenDataInterface;
}
