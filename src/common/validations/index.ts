// ** Package **
import Joi from 'joi';

// ** Others **
import { errorMessage } from '@/common/constants/validation.constants';
import _ from 'lodash';
import { LanguageEnum } from '../interfaces/general/general.interface';

export const joiCommon = {
  joiString: Joi.string()
    .trim()
    .messages({ ...errorMessage }),
  joiNumber: Joi.number().messages({ ...errorMessage }),
  joiBoolean: Joi.boolean().messages({ ...errorMessage }),
  joiDate: Joi.date()
    .iso()
    .messages({ ...errorMessage }),
  joiArray: Joi.array().messages({ ...errorMessage }),
  joiObject: Joi.object().messages({ ...errorMessage }),
  // ** For Pagination **
  joiPage: Joi.number()
    .messages({ ...errorMessage })
    .allow('', null),
  joiLimit: Joi.number().messages({ ...errorMessage }),
  joiFields: Joi.string()
    .messages({ ...errorMessage })
    .allow('', null),
  joiExclude: Joi.string()
    .messages({ ...errorMessage })
    .allow('', null),
  joiSort: Joi.object().messages({ ...errorMessage }),
  joiEmail: Joi.string()
    .messages({
      ...errorMessage,
      'string.email': '{#label} must be a valid email',
    })
    .email({ ignoreLength: true })
    .trim()
    .lowercase()
    .options({ convert: true }),
};

export const paramsIdSchema = Joi.object({
  id: joiCommon.joiNumber.required(),
}).options({
  abortEarly: false,
});

export const paramsSlugSchema = Joi.object({
  slug: joiCommon.joiString,
}).options({
  abortEarly: false,
});

export const querySchema = Joi.object({
  toast: joiCommon.joiBoolean,
}).options({
  allowUnknown: true,
  abortEarly: false,
});

const passwordRegEx = '^(?=.*[a-z])(?=.*[A-Z])*';
const numberRegex = '^[0-9]{9,10}$';
const codeRegex = '^([0|+[0-9]{1,5})$';

export const commonValidation = {
  passwordCommon: Joi.string()
    .min(6)
    .required()
    .pattern(new RegExp(passwordRegEx))
    .messages({
      ...errorMessage,
    }),
  no: Joi.string()
    .required()
    .pattern(new RegExp(numberRegex))
    .label('Phone Number')
    .messages({ ...errorMessage, 'string.pattern.base': `{#label} must be number 9 or 10 digit` }),
  code: Joi.string()
    .required()
    .pattern(new RegExp(codeRegex))
    .label('Country Code')
    .messages({ ...errorMessage, 'string.pattern.base': `Please enter valid country code` }),
  pageContent: Joi.array().items(
    Joi.object({
      title: joiCommon.joiString.required(),
      description: joiCommon.joiString.required(),
      title_ar: joiCommon.joiString,
      description_ar: joiCommon.joiString,
    }),
  ),
};

export const trashSchema = Joi.object({
  allId: joiCommon.joiArray.items(joiCommon.joiNumber.strict()).required().min(1),
}).options({
  abortEarly: false,
});

export const paginationSchema = Joi.object({
  page: joiCommon.joiPage,
  limit: joiCommon.joiLimit,
  exclude: joiCommon.joiExclude,
}).options({ abortEarly: false });

export const deleteManyBody = Joi.object({
  allId: joiCommon.joiArray.items(joiCommon.joiNumber.strict()).required().min(1),
  entity_id: joiCommon.joiNumber,
  field_id: joiCommon.joiNumber,
  message: joiCommon.joiString,
  model_record_id: joiCommon.joiNumber,
  toastMsg: joiCommon.joiString.allow('', null),
  type: joiCommon.joiString.allow('', null),
}).options({
  abortEarly: false,
});

export const paginationValidation = {
  id: Joi.number(),
  translation: Joi.any(),
  allLanguage: Joi.boolean(),
  getByParentId: Joi.number(),
  getByParentSlug: Joi.string(),
  simplifyResponseByLanguage: Joi.boolean(),
  page: Joi.number().label('Page'),
  limit: Joi.number().label('Limit'),
  sort: Joi.string().label('Sort'),
  profile: joiCommon.joiBoolean,
  dropdown: Joi.boolean().label('dropdown'),
  dropdownParent: Joi.boolean().label('dropdown parent'),
  search: Joi.custom((value) => {
    if (value) return value;
  }),
  value: joiCommon.joiString,
  label: joiCommon.joiString,
  view: joiCommon.joiBoolean,
  slug: joiCommon.joiString,
  sortType: joiCommon.joiString,
  sortName: joiCommon.joiString,
  relationalGroup: joiCommon.joiString,
};

export const commonCreate = {
  language: Joi.string().valid(...Object.values(LanguageEnum)),
  parent_table_id: Joi.number(),
};

export const keysToAdd = (key: string, value: any) => {
  const data = {};

  const languages = Object.values(LanguageEnum);
  languages.map((language) => {
    let validators: Joi.StringSchema<string> | Joi.NumberSchema<number> | Joi.AnySchema<any>;

    if (value.number) validators = joiCommon.joiNumber.label(`${_.startCase(key.replace(/ /g, '_'))}`);
    else if (value.boolean) validators = joiCommon.joiBoolean;
    else if (value.any) validators = Joi.any();
    else validators = joiCommon.joiString.label(`${_.startCase(key.replace(/ /g, '_'))} (${language})`);

    if (value.allow) validators = validators.allow(...value.allow);
    if (value.require) validators = validators.required();
    // if (value.max) validators = validators.max(value.max);
    data[`${key}_${language}`] = validators;
  });
  return data;
};

export const formObj = (stringValidationFields: object) => {
  let data = {};
  Object.entries(stringValidationFields || {}).forEach((entry) => {
    const [key, value] = entry;
    const returnData = keysToAdd(key, value);
    data = { ...data, ...returnData };
  });
  return data;
};
