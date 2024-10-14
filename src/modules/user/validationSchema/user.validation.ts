import { errorMessage } from '@/common/constants/validation.constants';
import { joiCommon, paginationValidation } from '@/common/validations';
import { USER_STATUS } from '@sequelizeDir/models/types/user.model.type';
import Joi from 'joi';

const joiData = {
  id: joiCommon.joiNumber.label('UserId'),
  first_name: joiCommon.joiString.max(50).label('First Name').allow('', null),
  last_name: joiCommon.joiString.max(50).label('Last Name').allow('', null),
  username: joiCommon.joiString.label('Username').allow('', null),
  email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .options({ convert: true }),
  phone: joiCommon.joiString.label('Phone number').allow('', null),
  contact: Joi.any().label('Contact number').allow('', null),
  gender: joiCommon.joiString.label('Gender').allow('', null),
  address1: joiCommon.joiString.label('Address1').allow('', null),
  address2: joiCommon.joiString.label('Address2').allow('', null),
  city: joiCommon.joiString.label('City').allow('', null),
  county: joiCommon.joiString.label('County').allow('', null),
  state: joiCommon.joiString.label('State').allow('', null),
  zip: joiCommon.joiString.label('Postal code').allow('', null),
  birth_date: joiCommon.joiDate.label('Birth date').allow('', null),
  added_by: joiCommon.joiNumber.label('Admin User').allow('', null),
  active: joiCommon.joiString.valid(...Object.keys(USER_STATUS)).label('Status'),
  date_format: joiCommon.joiString.label('Date Format').allow('', null),
  timezone: joiCommon.joiString.label('Timezone').allow('', null),
  profile_image: Joi.any(),
  role: joiCommon.joiNumber.label('Role').allow('', null),
  is_head: joiCommon.joiBoolean.label('Is department head').allow('', null),
  toastMsg: joiCommon.joiString.label('Toast Message'),
};

const trainerData = {
  hourly_rate: joiCommon.joiNumber.label('Trainer Hourly Rate'),
  travel_reimbursement_fee: joiCommon.joiNumber.label('Trainer Travel Reimbursement Fee'),
  location: joiCommon.joiString.label('Trainer Location').allow(null, ''),
  latitude: joiCommon.joiString.label('Trainer latitude').allow(null, ''),
  longitude: joiCommon.joiString.label('Trainer longitute').allow(null, ''),
};

const trainerDataSchema = Joi.object({
  hourly_rate: trainerData.hourly_rate.required(),
  travel_reimbursement_fee: trainerData.travel_reimbursement_fee.allow('', null),
  location: trainerData.location.optional(),
  latitude: trainerData.latitude.optional(),
  longitude: trainerData.longitude.optional(),
  sub_categories: joiCommon.joiArray.items(Joi.number()).optional(),
  trainer_attachment: Joi.any(),
  rate_by_admin: joiCommon.joiNumber,
});

const managerDataSchema = Joi.object({
  job_title: joiCommon.joiString.label('Job Title').required(),
  companies: joiCommon.joiArray.items(joiCommon.joiNumber.strict()).default([]),
});

const privateIndividualDataSchema = Joi.object({
  job_title: joiCommon.joiString.label('Job Title').required(),
  codice_fiscale: joiCommon.joiString.label('Codice Fiscale').required(),
});

export const createUserSchema = Joi.object({
  ...joiData,
  first_name: joiData.first_name.required(),
  last_name: joiData.last_name.required(),
  contact: joiData.contact.required(),
  email: joiData.email.required(),
  role: joiData.role.required(),
  profile: joiCommon.joiBoolean,
  active: joiData.active.required(),

  trainer: Joi.when('role', {
    is: 3,
    then: trainerDataSchema.required(),
    otherwise: trainerDataSchema.optional(),
  }).label('Trainer Data'),
}).options({
  abortEarly: false,
});

export const getUserSchema = Joi.object().keys({
  ...paginationValidation,
  status: joiCommon.joiString.label('Status'),
  is_head: Joi.any(),
  role: joiCommon.joiString,
  select: joiCommon.joiBoolean,
  ignore_is_active: joiCommon.joiBoolean,
  is_connection_user: joiCommon.joiBoolean,
  is_manager: joiCommon.joiBoolean,
});

export const updateUserSchema = Joi.object({
  first_name: joiData.first_name,
  last_name: joiData.last_name,
  contact: joiData.contact,
  email: joiData.email,
  profile: joiCommon.joiBoolean,
  active: joiData.active,
  role: joiCommon.joiNumber,
  profile_image: Joi.any(),
  trainer_attachment: Joi.any(),
  trainer: Joi.when('role', {
    is: 3,
    then: trainerDataSchema,
    otherwise: trainerDataSchema.optional(),
  }).label('Trainer Data'),
  manager: Joi.when('role', {
    is: 5,
    then: managerDataSchema,
    otherwise: managerDataSchema.optional(),
  }).label('Manager Data'),
  is_head: joiCommon.joiBoolean.label('Is department head').optional(),
}).options({
  abortEarly: false,
});

export const userUsernameParamSchema = Joi.object({
  username: joiCommon.joiString.label('User name').required(),
}).options({
  abortEarly: false,
});

export const trainerNotesParamSchema = Joi.object({
  slug: joiCommon.joiString.required(),
}).options({
  abortEarly: false,
});

export const roleValidations = Joi.object({
  role: joiCommon.joiNumber,
}).options({
  abortEarly: false,
});

export const deleteUserSocialAccountSchema = Joi.object({
  user_social_account_id: joiCommon.joiNumber.label('User social account id').required(),
}).options({
  abortEarly: false,
});

export const bulkUploadUserSchema = Joi.object({
  first_name: joiData.first_name.required(),
  last_name: joiData.last_name.required(),
  contact: joiData.contact.required(),
  email: joiData.email.required(),
  is_head: joiCommon.joiBoolean.label('Is department head').optional(),

  trainer: Joi.when('role', {
    is: 3,
    then: trainerDataSchema.required(),
    otherwise: trainerDataSchema.optional(),
  }).label('Trainer Data'),

  manager: Joi.when('role', {
    is: 5,
    then: managerDataSchema.required(),
    otherwise: managerDataSchema.optional(),
  }).label('Manager Data'),

  privateIndividual: Joi.when('role', {
    is: 8,
    then: privateIndividualDataSchema.required(),
    otherwise: privateIndividualDataSchema.optional(),
  }).label('Private Individual Data'),
}).options({
  abortEarly: false,
});

export const bulkUploadSchema = Joi.object({
  users: Joi.array().items(bulkUploadUserSchema).min(1),
  role: joiCommon.joiNumber,
})
  .custom((value, helpers) => {
    if (value.role === 3 && (!value.users || !value.users.every((user) => user.trainer))) {
      return helpers.message({ custom: 'Trainer data is required' });
    }
    if (value.role === 5 && (!value.users || !value.users.every((user) => user.manager))) {
      return helpers.message({ custom: 'Manager data is required' });
    }
    if (value.role === 8 && (!value.users || !value.users.every((user) => user.privateIndividual))) {
      return helpers.message({ custom: 'Private individual data is required' });
    }
    return value;
  })
  .messages({
    'any.required': '{{#label}} is required.',
  })
  .options({
    abortEarly: false,
  });
