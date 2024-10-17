import { Request } from 'express';
import { AuthRegisterPrivateIndividualReqInterface, AuthRegisterReqInterface } from '../interfaces/auth.interfaces';
import { RoleEnum } from '@/common/constants/enum.constant';

// export const authRegisterReq = (req: Request): AuthRegisterReqInterface => {
//   const { body } = req;
//   const {
//     company_name,
//     company_legal_name,
//     company_registration_number,
//     company_email,
//     company_address_l1,
//     company_address_l2,
//     company_address_city,
//     company_address_state,
//     company_address_country,
//     company_address_zip,
//     company_website,
//     company_industry,
//     company_description,
//     company_size,
//     company_accounting_emails,
//     company_ateco_code,
//     company_sdi_code,
//     company_vat_number,
//     company_is_invoice,

//     manager_first_name,
//     manager_last_name,
//     manager_job_title,
//     manager_email,
//     manager_contact,
//     manager_address_l1,
//     manager_address_l2,
//     manager_address_city,
//     manager_address_state,
//     manager_address_country,
//     manager_address_zip,
//   } = body;

//   const managerUserAdditionalDetails = {
//     job_title: manager_job_title,
//     billing_address1: company_address_l1,
//     billing_address2: company_address_l2,
//     billing_city: company_address_city,
//     billing_state: company_address_state,
//     billing_country: company_address_country,
//     billing_zip: company_address_zip,
//   };

//   return { companyUserDetails, companyUserAdditionDetails, managerUserDetails, managerUserAdditionalDetails };
// };

// export const authRegisterPrivateIndividualReq = (req: Request): AuthRegisterPrivateIndividualReqInterface => {
//   const { body } = req;
//   const { email, first_name, last_name, contact, job_title, codice_fiscale } = body;

//   const privateIndividualUserDetails = {
//     email: email,
//     first_name: first_name,
//     last_name: last_name,
//     contact: contact,
//     role: RoleEnum.PrivateIndividual,
//   };

//   const privateIndividualUserAdditionalDetails = {
//     job_title: job_title,
//     codice_fiscale: codice_fiscale,
//   };

//   return { privateIndividualUserDetails, privateIndividualUserAdditionalDetails };
// };
