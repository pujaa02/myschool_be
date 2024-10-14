import { ExamTokenInfoInterface, TokenDataInterface } from '@/modules/auth/interfaces/auth.interfaces';
import { Transaction } from 'sequelize';
import { LanguageEnum, LanguageEnumCMS } from '../general/general.interface';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tokenData: TokenDataInterface;
      transaction: Transaction;
      language: LanguageEnum | LanguageEnumCMS;
      timezone: string;
      examTokenInfo: ExamTokenInfoInterface;
    }
  }
}
