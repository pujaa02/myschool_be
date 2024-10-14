import { RoleEnum } from '@/common/constants/enum.constants';
import { Request } from 'express';
import { ManagerCreateReqInterface } from '../interfaces/manager.interface';

export const managerCreateReq = (req: Request): ManagerCreateReqInterface => {
  const { body } = req;
  const { first_name, last_name, job_title, email, contact } = body;

  const managerUserDetails = {
    email: email,
    first_name: first_name,
    last_name: last_name,
    contact: contact,
    role: RoleEnum.CompanyManager,
  };

  const managerUserAdditionalDetails = {
    job_title: job_title,
  };

  return { managerUserDetails, managerUserAdditionalDetails };
};
