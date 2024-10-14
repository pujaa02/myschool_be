import { RoleEnum } from '@/common/constants/enum.constants';
import { Request } from 'express';
import { ManagerUpdateReqInterface } from '../interfaces/manager.interface';

export const managerUpdateReq = (req: Request): ManagerUpdateReqInterface => {
  const { body } = req;
  const { first_name, last_name, job_title, email, contact, company } = body;

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

  const companyAdditionalDetails = {
    id: company?.id,
    name: company?.name,
    legal_name: company?.legal_name,
    registration_number: company?.registration_number,
    website: company?.website,
    industry: company?.industry,
    description: company?.description,
    size: company?.size,

    address_l1: company?.address_l1,
    address_l2: company?.address_l2,
    address_city: company?.address_city,
    address_country: company?.address_country,
    address_zip: company?.address_zip,

    ateco_code: company?.ateco_code,

    accounting_emails: company?.accounting_emails,

    sdi_code: company?.sdi_code,

    vat_number: company?.vat_number,
  };
  return { managerUserDetails, managerUserAdditionalDetails, companyAdditionalDetails };
};
