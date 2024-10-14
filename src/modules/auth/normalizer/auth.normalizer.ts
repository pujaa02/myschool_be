import { RoleEnum } from '@/common/constants/enum.constants';
import { Request } from 'express';
import { AuthRegisterPrivateIndividualReqInterface, AuthRegisterReqInterface } from '../interfaces/auth.interfaces';

export const authRegisterReq = (req: Request): AuthRegisterReqInterface => {
  const { body } = req;
  const {
    company_name,
    company_legal_name,
    company_registration_number,
    company_email,
    company_address_l1,
    company_address_l2,
    company_address_city,
    company_address_state,
    company_address_country,
    company_address_zip,
    company_website,
    company_industry,
    company_description,
    company_size,
    company_accounting_emails,
    company_ateco_code,
    company_sdi_code,
    company_vat_number,
    company_is_invoice,

    manager_first_name,
    manager_last_name,
    manager_job_title,
    manager_email,
    manager_contact,
    manager_address_l1,
    manager_address_l2,
    manager_address_city,
    manager_address_state,
    manager_address_country,
    manager_address_zip,
  } = body;

  const companyUserDetails = {
    email: company_email,
    first_name: company_name,
    last_name: company_legal_name,
    address1: company_address_l1,
    address2: company_address_l2,
    city: company_address_city,
    state: company_address_state,
    country: company_address_country,
    zip: company_address_zip,
    role: RoleEnum.Company,
  };

  const companyUserAdditionDetails = {
    name: company_name,
    legal_name: company_legal_name,
    registration_number: company_registration_number,
    website: company_website,
    industry: company_industry,
    description: company_description,
    size: company_size,
    accounting_emails: company_accounting_emails,
    ateco_code: company_ateco_code,
    sdi_code: company_sdi_code,
    vat_number: company_vat_number,
    is_invoice: company_is_invoice,
    files: req.files,
  };

  const managerUserDetails = {
    email: manager_email,
    first_name: manager_first_name,
    last_name: manager_last_name,
    contact: manager_contact,
    address1: manager_address_l1,
    address2: manager_address_l2,
    city: manager_address_city,
    state: manager_address_state,
    country: manager_address_country,
    zip: manager_address_zip,
    role: RoleEnum.CompanyManager,
  };

  const managerUserAdditionalDetails = {
    job_title: manager_job_title,
    billing_address1: company_address_l1,
    billing_address2: company_address_l2,
    billing_city: company_address_city,
    billing_state: company_address_state,
    billing_country: company_address_country,
    billing_zip: company_address_zip,
  };

  return { companyUserDetails, companyUserAdditionDetails, managerUserDetails, managerUserAdditionalDetails };
};

export const authRegisterPrivateIndividualReq = (req: Request): AuthRegisterPrivateIndividualReqInterface => {
  const { body } = req;
  const { email, first_name, last_name, contact, job_title, codice_fiscale } = body;

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
