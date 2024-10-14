import { RoleEnum } from '@/common/constants/enum.constants';
import { Request } from 'express';
import { TrainerUpdateReqInterface } from '../interfaces/trainer.interface';

export const trainerUpdateReq = (req: Request): TrainerUpdateReqInterface => {
  const { body } = req;
  const {
    first_name,
    last_name,
    email,
    contact,
    hourly_rate,
    travel_reimbursement_fee,
    latitude,
    longitude,
    location,
    sub_categories,
    trainer_attachment,
    rate_by_admin,
  } = body;

  const trainerUserDetails = {
    email: email,
    first_name: first_name,
    last_name: last_name,
    contact: contact,
    role: RoleEnum.Trainer,
  };

  const trainerUserAdditionalDetails = {
    hourly_rate,
    travel_reimbursement_fee,
    rate_by_admin,
    location,
    longitude,
    latitude,
    subCategories: sub_categories,
    trainer_attachment:
      typeof trainer_attachment === 'string' ? [trainer_attachment] : trainer_attachment?.length ? trainer_attachment : [],
  };
  return { trainerUserAdditionalDetails, trainerUserDetails };
};
