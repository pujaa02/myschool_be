import { errorMessage } from '@/common/constants/validation.constants';
import { commonValidation, joiCommon } from '@/common/validations';
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().allow('').required(),
  is_remember: Joi.boolean().allow(null).default(false),
  password: commonValidation.passwordCommon.label('Password'),
  notificationToken: Joi.string().label('Device token'),
}).options({
  abortEarly: false,
});

export const register = Joi.object({
  company_name: joiCommon.joiString.label('Company Name').required(),
  company_legal_name: joiCommon.joiString.label('Company Legal Name').allow('', null),
  company_registration_number: joiCommon.joiString.label('Company Registation Number').required(),
  company_email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .optional(),
  company_address_l1: joiCommon.joiString.label('Company Address Line 1').required(),
  company_address_l2: joiCommon.joiString.label('Company Address Line 2').allow('', null).optional(),
  company_address_city: joiCommon.joiString.label('Company Address City').allow('', null).optional(),
  // company_address_state: joiCommon.joiString.label('Company Address State'),
  company_address_country: joiCommon.joiString.label('Company Address Country').required(),
  company_address_zip: joiCommon.joiString.label('Company Address Zip').required(),
  company_website: joiCommon.joiString.label('Company Website').allow('', null).optional(),
  company_industry: joiCommon.joiString.label('Company Industry').allow('', null).optional(),
  company_description: joiCommon.joiString.label('Company Description').allow('', null).optional(),
  company_size: joiCommon.joiString.label('Company Size').allow('', null).optional(),
  // company_logo: Joi.any().required(),
  company_accounting_emails: joiCommon.joiArray.items(
    Joi.object({
      is_primary: joiCommon.joiBoolean.label('Is Primary').required(),
      email: joiCommon.joiString.email({ ignoreLength: true }).label('Email Value').required(),
    }),
  ),
  company_ateco_code: joiCommon.joiString
    .regex(/^\d+$/)
    .label('ATECO Code')
    .messages({
      ...errorMessage,
      'string.pattern.base': '{#label} must be a valid ATECO code',
    }),
  company_sdi_code: joiCommon.joiString
    .regex(/^[a-zA-Z0-9]{7}$/)
    .label('SDI Code')
    .required(),

  company_vat_number: Joi.string().label('VAT Number').optional(),

  company_is_invoice: joiCommon.joiBoolean.label('Is_invoice').required(),

  manager_first_name: joiCommon.joiString.label('Manager First Name').required(),
  manager_last_name: joiCommon.joiString.label('Manager Last Name').required(),
  manager_job_title: joiCommon.joiString.label('Manager Job Title').required(),
  manager_email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .required(),
  manager_contact: joiCommon.joiString.label('Manager Contact').required(),
  manager_address_l1: joiCommon.joiString.label('Manager Address Line 1').allow('', null).optional(),
  manager_address_l2: joiCommon.joiString.label('Manager Address Line 2').allow('', null).optional(),
  manager_address_city: joiCommon.joiString.label('Manager Address City').allow('', null).optional(),
  manager_address_state: joiCommon.joiString.label('Manager Address State').allow('', null).optional(),
  manager_address_country: joiCommon.joiString.label('Manager Address Country').allow('', null).optional(),
  manager_address_zip: joiCommon.joiString.label('Manager Address Zip').allow('', null).optional(),
  address_province: joiCommon.joiString,
  vat_type: joiCommon.joiNumber,
}).options({
  abortEarly: false,
});

export const registerPrivateIndividual = Joi.object({
  first_name: joiCommon.joiString.label('First Name').required(),
  last_name: joiCommon.joiString.label('Last Name').required(),
  job_title: joiCommon.joiString.label('Job Title').required(),
  email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .required(),
  contact: joiCommon.joiString.label('Contact').required(),
  codice_fiscale: joiCommon.joiString.label('Codice fiscale').required(),
}).options({
  abortEarly: false,
});

export const otpVerificationSchema = Joi.object({
  email: Joi.string().required(),
  otp: Joi.number()
    .min(6)
    .required()
    .label('OTP')
    .messages({ ...errorMessage }),
  type: Joi.string()
    .valid('REGISTER', 'FORGOT')
    .required()
    .label('Type')
    .messages({ ...errorMessage }),
}).options({
  abortEarly: false,
});

export const otpResendSchema = Joi.object({
  email: Joi.string().required(),
  type: Joi.string()
    .valid('REGISTER', 'FORGOT')
    .required()
    .label('Type')
    .messages({ ...errorMessage }),
}).options({
  abortEarly: false,
});

export const setPasswordSchema = Joi.object({
  password: commonValidation.passwordCommon.label('Password'),
}).options({
  abortEarly: false,
});

export const ResetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/)
    .required()
    .label('Password')
    .messages({
      ...errorMessage,
      'string.pattern.base':
        '{#label} must have at least one uppercase character, one lowercase character, one numeric character and one special character',
    }),
}).options({
  abortEarly: false,
});

export const Verify2FASchema = Joi.object({
  code: Joi.string()
    .required()
    .label('Code')
    .messages({ ...errorMessage }),
  secret: joiCommon.joiString.label('Secret key'),
  is_remember: Joi.boolean().allow(null).default(false),
}).options({ allowUnknown: false });

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ ignoreLength: true })
    .required()
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .options({ convert: true }),
}).options({
  abortEarly: false,
});

export const changePasswordSchema = Joi.object({
  oldPassword: commonValidation.passwordCommon.label('Old Password'),
  newPassword: commonValidation.passwordCommon.label('New Password'),
}).options({
  abortEarly: false,
});

export const resetPasswordSchema = Joi.object({
  password: commonValidation.passwordCommon.label('Password'),
  confirm_password: Joi.any().valid(Joi.ref('password')).required().label('Confirm Password Must match password.'),
});
