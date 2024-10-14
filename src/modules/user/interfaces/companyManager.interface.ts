import { CompanyManagerAttributesType } from '@/sequelizeDir/models/types/companyManager.model.type';
import { User } from 'aws-sdk/clients/budgets';
import { Transaction } from 'sequelize';

export interface BuildCompanyManagerArgs {
  data: Partial<CompanyManagerAttributesType>;
  user?: User;
  transaction: Transaction;
}
