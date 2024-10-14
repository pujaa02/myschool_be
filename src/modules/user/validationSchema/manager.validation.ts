import { errorMessage } from '@/common/constants/validation.constants';
import { joiCommon } from '@/common/validations';
import Joi from 'joi';

const joiData = {
  id: joiCommon.joiNumber.label('Manager Id'),
  first_name: joiCommon.joiString.label('First Name'),
  last_name: joiCommon.joiString.label('Last Name'),
  job_title: joiCommon.joiString.label('Job Title'),
  email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .required(),
  contact: joiCommon.joiString.label('Contact'),
};

export const createManagerSchema = Joi.object({
  ...joiData,
  first_name: joiCommon.joiString.label('First Name').required(),
  last_name: joiCommon.joiString.label('Last Name').required(),
  job_title: joiCommon.joiString.label('Job Title').required(),
  role: joiCommon.joiString,
  email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .required(),
  contact: joiCommon.joiString.label('Contact').required(),
  companies: joiCommon.joiString.label('Companies').allow('', null).default([]),
}).options({
  abortEarly: false,
});

const companyDataSchema = Joi.object({
  id: joiCommon.joiString.label('Company Id'),
  name: joiCommon.joiString.label('Company Name'),
  legal_name: joiCommon.joiString.label('Company Legal Name'),
  registration_number: joiCommon.joiString.label('Registration Number'),
  website: joiCommon.joiString.label('Webiste').allow('', null),
  industry: joiCommon.joiString.label('Industry').allow('', null),
  description: joiCommon.joiString.label('Description'),
  size: joiCommon.joiString.label('Company Size').allow('', null),
  company_logo: Joi.any(),

  address_l1: joiCommon.joiString.label('Address Line 1'),
  address_l2: joiCommon.joiString.label('Address Line 2'),
  address_city: joiCommon.joiString.label('Address City'),
  address_country: joiCommon.joiString.label('Address Country'),
  address_zip: joiCommon.joiString.label('Address Zip'),

  ateco_code: joiCommon.joiString
    .regex(/^\d+$/)
    .label('ATECO Code')
    .messages({
      ...errorMessage,
      'string.pattern.base': '{#label} must be a valid ATECO code',
    }),

  accounting_emails: joiCommon.joiArray.items(
    Joi.object({
      isPrimary: joiCommon.joiBoolean.label('Is Primary'),
      value: joiCommon.joiString.email({ ignoreLength: true }).label('Email Value'),
    }),
  ),

  sdi_code: joiCommon.joiString.regex(/^[a-zA-Z0-9]{7}$/).label('SDI Code'),

  vat_number: Joi.string().label('VAT Number'),
});

export const updateManagerSchema = Joi.object({
  ...joiData,
  role: joiCommon.joiString,
  first_name: joiCommon.joiString.label('First Name').optional(),
  last_name: joiCommon.joiString.label('Last Name').optional(),
  job_title: joiCommon.joiString.label('Job Title').optional(),
  email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .optional(),
  contact: joiCommon.joiString.label('Contact').optional(),
  companies: joiCommon.joiString.label('Companies').optional(),
  company: companyDataSchema.label('Company'),
}).options({
  abortEarly: false,
});

export const companySlugParamSchema = Joi.object({
  company_slug: joiCommon.joiString.label('Company slug').required(),
}).options({
  abortEarly: false,
});
