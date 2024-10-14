import BaseRepository from '@/modules/common/base.repository';
import CompanyManager from '@/sequelizeDir/models/companyManager.model';
import { BuildCompanyManagerArgs } from '../interfaces/companyManager.interface';

export default class CompanyManagerRepo extends BaseRepository<CompanyManager> {
  constructor() {
    super(CompanyManager.name);
  }

  readonly createCompanyManager = async (managerArgs: BuildCompanyManagerArgs) => {
    const { data, transaction } = managerArgs;
    return this.create(
      {
        company_id: data.company_id,
        manager_id: data.manager_id,
        parent_table_id: data.parent_table_id,
        language: data.language,
      },
      {
        transaction,
      },
    );
  };
}
