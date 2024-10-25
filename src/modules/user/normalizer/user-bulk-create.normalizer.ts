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
        // is_head: user.is_head,
      },
    };
  });

  return data;
};
