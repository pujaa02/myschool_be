// ============= Import Packages ================
import { USER_STATUS } from '../../../models/interfaces/user.model.interface';
import { errorMessage } from '../../../common/constants/validation.constant';
import { joiCommon } from '../../../common/validations/common.validation';
import Joi from 'joi';
// ==============================================

const joiData = {
  id: joiCommon.joiNumber.label('UserId'),
  user_role: joiCommon.joiNumber.label('user_role'),
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
  mobile: joiCommon.joiString.label('Mobile number').allow('', null),
  password: joiCommon.joiString
    .min(12)
    .max(254)
    .label('Password')
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{12,}$/)
    .messages({
      ...errorMessage,
      'string.pattern.base':
        '{#label} must have at least one uppercase character, one lowercase character, one numeric character and one special character',
    }),
  confirmPassword: joiCommon.joiString.label('Confirm Password').allow('', null),
  date_format: joiCommon.joiString.label('Date Format'),
  timezone: joiCommon.joiString.label('Time Zone').allow('', null),
  user_signature: joiCommon.joiString.label('User Signature').allow('', null),
  website: joiCommon.joiString.label('Website').allow('', null),
  gender: joiCommon.joiString.label('Gender').allow('', null),
  address1: joiCommon.joiString.label('Address1').allow('', null),
  address2: joiCommon.joiString.label('Address2').allow('', null),
  city: joiCommon.joiString.label('City').allow('', null),
  county: joiCommon.joiString.label('County').allow('', null),
  state_id: joiCommon.joiNumber.label('State').allow('', null),
  country_id: joiCommon.joiNumber.label('Country').allow('', null),
  zip: joiCommon.joiString.label('Postal code').allow('', null),
  verified: joiCommon.joiBoolean,
  birth_date: joiCommon.joiDate.label('Birth date').allow('', null),
  added_by: joiCommon.joiNumber.label('Admin User').allow('', null),
  user_status: joiCommon.joiString.valid(...Object.keys(USER_STATUS)).label('Status'),
  profile_image: Joi.any(),
  toastMsg: joiCommon.joiString.allow('', null),
};

export const RegisterSchema = Joi.object({
  ...joiData,
  first_name: joiData.first_name.required(),
  last_name: joiData.last_name.required(),
  password: joiData.password.required(),
  email: joiData.email.required(),
}).options({
  abortEarly: false,
});

export const LoginSchema = Joi.object({
  email: Joi.string()
    .email({ ignoreLength: true })
    .required()
    .lowercase()
    .options({ convert: true })
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' }),

  password: Joi.string()
    .required()
    .label('Password')
    .messages({ ...errorMessage }),
}).options({
  abortEarly: false,
});

export const IsEmailExistSchema = Joi.object({
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

export const LoginWithGoogleSchema = Joi.object({
  idToken: Joi.string()
    .required()
    .label('Google IdToken')
    .messages({ ...errorMessage }),
  timezone: joiCommon.joiString.label('Time Zone'),
}).options({
  abortEarly: false,
});

export const LoginWithAppleSchema = Joi.object({
  authorization: Joi.object()
    .required()
    .label('Authorization')
    .messages({ ...errorMessage }),
  user: Joi.object()
    .label('user')
    .messages({ ...errorMessage })
    .allow('', null),
  timezone: joiCommon.joiString.label('Time Zone'),
}).options({
  abortEarly: false,
});

export const Veirfy2FASchema = Joi.object({
  code: Joi.number()
    .required()
    .label('Code')
    .messages({ ...errorMessage }),
  secret: joiCommon.joiString.label('Secret key'),
  twoFa_status: joiCommon.joiBoolean.label('Tow Factor Enable'),
}).options({ allowUnknown: false });

export const VerifyAccountByEmailSchema = Joi.object({
  token: Joi.string()
    .required()
    .label('Token')
    .messages({ ...errorMessage }),
}).options({
  abortEarly: false,
});

export const ForgotPasswordSchema = Joi.alternatives()
  .try(
    Joi.object({
      email: Joi.string()
        .email({ ignoreLength: true })
        .required()
        .label('Email')
        .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' })
        .lowercase()
        .options({ convert: true }),
    }),
    Joi.object({
      expiredToken: Joi.string()
        .required()
        .label('Token')
        .messages({ ...errorMessage }),
    }),
  )
  .options({
    abortEarly: false,
  });

export const ResetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .label('Token')
    .messages({ ...errorMessage }),

  password: Joi.string()
    .required()
    .label('Password')
    .messages({
      ...errorMessage,
      'string.pattern.base': 'Invalid Password',
    }),
}).options({
  abortEarly: false,
});

export const changePasswordJoiSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(16)
    .required()
    .label('Password')
    .messages({ ...errorMessage }),
}).options({
  abortEarly: false,
});

export const ChangePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .label('Old Password')
    .messages({ ...errorMessage }),

  newPassword: Joi.string()
    .min(8)
    .max(16)
    .required()
    .label('New Password')
    .messages({
      ...errorMessage,
      'string.pattern.base':
        '{#label} must have at least one uppercase character, one lowercase character, one numeric character and one special character',
    }),
}).options({
  abortEarly: false,
});

export const sendInvitationSchema = Joi.object({
  user_id: Joi.number()
    .required()
    .label('User Id')
    .messages({ ...errorMessage }),
}).options({
  abortEarly: false,
});
