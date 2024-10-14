import { errorMessage } from '@/common/constants/validation.constants';
import { joiCommon, paginationValidation } from '@/common/validations';
import { CourseStatus } from '@/sequelizeDir/models/types/course.model.type';
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
  contact: joiCommon.joiString.label('Contact number').allow('', null),
  active: joiCommon.joiString.valid(...Object.keys(USER_STATUS)).label('Status'),
  profile_image: Joi.any(),
};

const trainerData = {
  hourly_rate: joiCommon.joiNumber.label('Trainer Hourly Rate'),
  travel_reimbursement_fee: joiCommon.joiNumber.label('Trainer Travel Reimbursement Fee'),
  rate_by_admin: joiCommon.joiNumber,
  location: joiCommon.joiString.label('Trainer Location').allow(null),
};

export const updateTrainerSchema = Joi.object({
  first_name: joiData.first_name,
  last_name: joiData.last_name,
  contact: joiData.contact,
  email: joiData.email,
  active: joiData.active,
  profile_image: Joi.any(),
  hourly_rate: trainerData.hourly_rate,
  travel_reimbursement_fee: trainerData.travel_reimbursement_fee.allow('', null),
  location: trainerData.location,
  sub_categories: joiCommon.joiArray.items(Joi.number()).default([]),
  attachments: joiCommon.joiArray.items(Joi.string()).default([]),
  trainer_attachment: Joi.any(),
}).options({
  abortEarly: false,
});

export const updateTrainerDataSchema = Joi.object({
  course_slug: joiCommon.joiString,
  course_participate_id: joiCommon.joiNumber,
  set_early_arrival: joiCommon.joiString.allow('', null),
  set_early_leave: joiCommon.joiString.allow('', null),
  start_signature: Joi.any().allow('', null),
  end_signature: Joi.any().allow('', null),
  lesson_session_id: joiCommon.joiNumber.allow('', null),
  mark_as_absent: joiCommon.joiBoolean.allow('', null),
}).options({
  abortEarly: false,
});

export const updateCompanyWiseSignedSheet = Joi.object({
  companies: joiCommon.joiArray.items(joiCommon.joiNumber),
}).options({
  abortEarly: false,
});

export const updateParticipateSigned = Joi.object({
  participateSlug: joiCommon.joiString,
  lessonSessionSlug: joiCommon.joiArray.items(joiCommon.joiString).allow(null),
}).options({
  abortEarly: false,
});
export const getTrainerCourseSchema = Joi.object().keys({
  ...paginationValidation,
  course_slug: Joi.string(),
  lesson_session_id: Joi.number(),
  course_bundle_slug: Joi.string(),
  courseCategory: joiCommon.joiString,
  course_type: joiCommon.joiString,
  companies: joiCommon.joiString,
  company_id: joiCommon.joiNumber,
  trainingSpecialist: joiCommon.joiString,
  status: joiCommon.joiString.valid(...Object.values(CourseStatus)),
  is_invite: joiCommon.joiBoolean,
});

export const trainerSurveyValidationSchema = Joi.object().keys({
  ...paginationValidation,
  notes: Joi.string(),
  trainer_id: joiCommon.joiNumber,
  trainer_name: Joi.string(),
  role: joiCommon.joiNumber,
});

export const trainerNotesValidationSchema = Joi.object().keys({
  ...paginationValidation,
  notes: Joi.string(),
  trainer_id: joiCommon.joiNumber,
  trainer_name: Joi.string(),
  role: joiCommon.joiNumber,
});

export const getFilteredTrainersSchema = Joi.object().keys({
  ...paginationValidation,
  dates: joiCommon.joiString.required(),
  allAssignedTrainers: joiCommon.joiString,
  course_slug: Joi.string(),
  course_bundle_slug: Joi.string(),
  categorySlug: joiCommon.joiString,
  rateFilter: joiCommon.joiBoolean.default(true),
});

export const getTrainerCourseBundleSchema = Joi.object().keys({
  ...paginationValidation,
  course_slug: joiCommon.joiString,
  course_bundle_id: joiCommon.joiNumber,
  course_bundle_slug: joiCommon.joiString,
  status: joiCommon.joiString.valid(...Object.values(CourseStatus)),
});

export const rejectSchema = Joi.object().keys({
  course_slug: joiCommon.joiString.required(),
  course_bundle_id: joiCommon.joiNumber,
});

export const rejectCourseBundleSchema = Joi.object().keys({
  course_bundle_id: joiCommon.joiNumber.required(),
  course_slug: joiCommon.joiString.allow(null).required(),
});

export const acceptSchema = Joi.object().keys({
  course_slug: joiCommon.joiString.required(),
  course_bundle_id: joiCommon.joiNumber,
  accept_entire_course: joiCommon.joiBoolean,
  lesson_session_slugs: joiCommon.joiArray.items(joiCommon.joiString),
});

export const acceptCourseBundleSchema = Joi.object().keys({
  course_bundle_id: joiCommon.joiNumber.required(),
  accept_entire_bundle: joiCommon.joiBoolean,
  course_slug: joiCommon.joiString,
});
