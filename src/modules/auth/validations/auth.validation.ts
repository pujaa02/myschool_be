// ============= Import Packages ================
import { errorMessage } from '@/common/constants/validation.constant';
import { commonValidation, joiCommon } from '@/common/validations/common.validation';
import Joi from 'joi';
// ==============================================

export const RegisterSchema = Joi.object({
  first_name: Joi.string()
    .required()
    .max(50)
    .label('First name')
    .messages({ ...errorMessage }),

  last_name: Joi.string()
    .required()
    .max(50)
    .label('Last name')
    .messages({ ...errorMessage }),

  email: Joi.string()
    .required()
    .max(100)
    .label('Email')
    .lowercase()
    .options({ convert: true })
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' }),

  password: Joi.string()
    .min(8)
    .max(16)
    .required()
    .label('Password')
    .messages({
      ...errorMessage,
      'string.pattern.base':
        '{#label} must have at least one uppercase character, one lowercase character, one numeric character and one special character',
    }),
  mobile: Joi.string()
    .max(50)
    .label('Mobile number')
    .messages({ ...errorMessage })
    .allow('', null),

  organizationName: Joi.string()
    .label('organizationName')
    .messages({ ...errorMessage })
    .allow('', null),

  organizationCategory: Joi.string()
    .label('organizationCategory')
    .messages({ ...errorMessage })
    .allow('', null),
  timezone: joiCommon.joiString.label('Time Zone'),
  initial_color: Joi.any(),
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