import { commonCreate, joiCommon, paginationValidation } from '@/common/validations';
import Joi from 'joi';
// const updateObj = formObj(commonFiles.updateCode);
export const createSystemLogSchema = Joi.object().keys({
  ...commonCreate,
  description: Joi.string(),
  title: Joi.string(),
  module_id: Joi.string(),
  feature_id: Joi.string(),
});

export const getSystemLogSchema = Joi.object().keys({
  ...paginationValidation,
  select: joiCommon.joiBoolean,
  title: joiCommon.joiString,
  description: joiCommon.joiString,
  modulesId: joiCommon.joiString,
  startDate: joiCommon.joiString,
  endDate: joiCommon.joiString,
});
