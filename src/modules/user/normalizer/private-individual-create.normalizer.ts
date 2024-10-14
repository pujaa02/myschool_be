import { RoleEnum } from '@/common/constants/enum.constants';
import { Request } from 'express';
import { PrivateIndividualCreateReqInterface } from '../interfaces/privateIndividual.interface';

export const privateIndividualCreateReq = (req: Request): PrivateIndividualCreateReqInterface => {
  const { body } = req;
  const { first_name, last_name, job_title, email, contact, codice_fiscale } = body;

  const privateIndividualUserDetails = {
    email: email,
    first_name: first_name,
    last_name: last_name,
    contact: contact,
    role: RoleEnum.PrivateIndividual,
  };

  const privateIndividualUserAdditionalDetails = {
    job_title: job_title,
    codice_fiscale: codice_fiscale,
  };

  return { privateIndividualUserDetails, privateIndividualUserAdditionalDetails };
};
