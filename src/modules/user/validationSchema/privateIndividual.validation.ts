import { errorMessage } from '@/common/constants/validation.constants';
import { joiCommon, paginationValidation } from '@/common/validations';
import { CourseStatus } from '@/sequelizeDir/models/types/course.model.type';
import Joi from 'joi';

const joiData = {
  id: joiCommon.joiNumber.label('Private Individual Id'),
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

export const createPrivateIndividualSchema = Joi.object({
  ...joiData,
  first_name: joiCommon.joiString.label('First Name').required(),
  last_name: joiCommon.joiString.label('Last Name').required(),
  job_title: joiCommon.joiString.label('Job Title').required(),
  codice_fiscale: joiCommon.joiString.label('Codice fiscale').required(),
  role: joiCommon.joiString,
  email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .required(),
  contact: joiCommon.joiString.label('Contact').required(),
}).options({
  abortEarly: false,
});

export const updatePrivateIndividualSchema = Joi.object({
  ...joiData,
  first_name: joiCommon.joiString.label('First Name').optional(),
  last_name: joiCommon.joiString.label('Last Name').optional(),
  job_title: joiCommon.joiString.label('Job Title').optional(),
  role: joiCommon.joiString,
  codice_fiscale: joiCommon.joiString.label('Codice fiscale').required(),
  email: joiCommon.joiString
    .email({ ignoreLength: true })
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
    .lowercase()
    .optional(),
  contact: joiCommon.joiString.label('Contact').optional(),
}).options({
  abortEarly: false,
});

export const userNameSlugParamSchema = Joi.object({
  company_slug: joiCommon.joiString.label('Username slug').required(),
}).options({
  abortEarly: false,
});

export const courses = Joi.object({
  private_individual_id: joiCommon.joiNumber.required(),
  course_slug: joiCommon.joiString.required(),
  status: joiCommon.joiString.valid(...Object.values(CourseStatus)).default(CourseStatus.draft),
  course_type: joiCommon.joiString,
  course_to_ignore: joiCommon.joiString,
  marked_as: joiCommon.joiString,
  detailedView: joiCommon.joiBoolean,
  courseSubCategory: joiCommon.joiString,
  courseCategory: joiCommon.joiString,
  startDate: joiCommon.joiString,
  endDate: joiCommon.joiString,
  ...paginationValidation,
}).options({
  abortEarly: false,
});
