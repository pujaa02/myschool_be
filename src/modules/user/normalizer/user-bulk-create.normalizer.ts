import { BulkUploadBody, UserRelationalDataMap } from '../interfaces/user.interfaces';

export const bulkUserCreateNormalizer = (users: BulkUploadBody['users']): UserRelationalDataMap => {
  const data: UserRelationalDataMap = {};

  users.forEach((user) => {
    data[user.email] = {
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        contact: user.contact,
        active: user.active,
        role: user.role,
        is_head: user.is_head,
      },
      trainer: {
        hourly_rate: user?.trainer?.hourly_rate,
        travel_reimbursement_fee: user?.trainer?.travel_reimbursement_fee,
        location: user?.trainer?.location,
        rate_by_admin: user?.trainer?.rate_by_admin,
        latitude: user?.trainer?.latitude,
        longitude: user?.trainer?.longitude,
      },
      privateIndividual: {
        job_title: user?.privateIndividual?.job_title,
        codice_fiscale: user?.privateIndividual?.codice_fiscale,
      },
      manager: {
        job_title: user?.manager?.job_title,
        companies: user?.manager?.companies,
      },
    };
  });

  return data;
};
