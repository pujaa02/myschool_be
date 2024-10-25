import { queryBuildCases, RoleEnum } from '../../../constants/enum.constant';
// import { LanguageEnum } from '../../../interfaces/general/general.interface';
import { USER_STATUS } from '../../../../models/interfaces/user.model.interface';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Request } from 'express';
import _ from 'lodash';

export const caseHandlers = {
  [queryBuildCases.getAllRoleWiseData]: handleAllRoleWiseData,
  [queryBuildCases.getFeatureDropdown]: handleGetFeatureDropdown,
  default: handleDefault,
};

export async function handleDefault(_req: Request) {
  // Handle default casez
}

export async function handleAllOrderComments(_req: Request) {
  _.set(_req.query, 'sort', '-id');
}
export async function handleAllOrderAttachments(_req: Request) {
  // _.set(req.query, 'sort', '-id');
}

export async function handleAllCreditNotes(req: Request) {
  _.set(req.query, 'include[invoice]', 'all');
  _.set(req.query, 'include[order]', 'all');
  _.set(req.query, 'include[company][select]', 'id,name,logo');
  _.set(req.query, 'include[company]required', true);
  _.set(req.query, 'include[quote_product]', 'all');
  // _.set(req.query, 'include[quote_product]required', true);
  _.set(req.query, 'include[payment_terms]', 'all');
  if (req?.query?.startDate && req?.query?.endDate) {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    _.set(req?.query, 'q[created_at][between]', [startDate, endDate]);
  }
}

// export async function handleAllTrainer(req: Request) {
//   _.set(req.query, 'q[active]', USER_STATUS.ACTIVE);
//   _.set(req.query, 'include[role]q[name]', RoleEnum.Trainer);
//   _.set(req.query, 'include[role][required]', true);
// }
// export async function handleTrainerAllInvoice(req: Request) {
//   if (req.query.trainerId) {
//     _.set(req.query, 'q[trainer_id]', req.query.trainerId);
//     _.set(req.query, 'include[trainer_invoice]', 'all');
//     _.set(req.query, 'include[invoice_product]', 'all');
//     _.set(req.query, 'include[invoice_product]include[order]', 'all');
//   }
// }
// export async function handleAllSupplierName(req: Request) {
//   if (req.query.name) {
//     _.set(req.query, 'q[name][ne]', null);
//     _.set(req.query, 'select', 'name');
//   }
// }

// export async function handleAllSupplier(req: Request) {
//   if (req.query.category) {
//     _.set(req.query, 'q[category][ne]', null);
//     _.set(req.query, 'select', 'category');
//   }
// }
export async function handleAllExpense(req: Request) {
  if (req.query.slug) {
    _.set(req.query, 'q[slug]', req.query.slug);
  }
  if (req?.query?.name) {
    _.set(req.query, 'q[name][in]', (req?.query?.name as string).split(','));
  }
  if (req?.query?.category) {
    _.set(req.query, 'q[category][in]', (req?.query?.category as string).split(','));
  }
}

export async function handleTrainerInvoice(req: Request) {
  if (req.query.trainerId) {
    _.set(req.query, 'q[trainer_id]', req.query.trainerId);
  }
  if (req.query.monthly) {
    _.set(req?.query, 'q[created_at][between]', [startOfMonth(new Date()), endOfMonth(new Date())]);
  }

  _.set(req.query, 'include[lesson_session]', 'all');
  _.set(req.query, 'include[lesson_session][required]', true);
  _.set(req.query, 'include[lesson_session]include[lesson]', 'all');
  _.set(req.query, 'include[trainer_course]', 'all');
  _.set(req.query, 'include[trainer_course][required]', true);
  _.set(req.query, 'include[trainer_course][required]', true);
  _.set(req.query, 'include[trainer_course]include[courseCategory]', 'all');
  _.set(req.query, 'include[trainer_course]include[courseSubCategory]', 'all');
  _.set(req.query, 'include[trainer_course][include][codes]', 'all');
  _.set(req.query, 'include[trainer_course][include][projects]', 'all');
  _.set(req.query, 'include[trainer_course][include][projects][include][project_quotes]', 'all');
  _.set(req.query, 'include[trainer_course][include][projects][include][project_quotes][include][quote]', 'all');
  _.set(
    req.query,
    'include[trainer_course][include][projects][include][project_quotes][include][quote][include][company]',
    'all',
  );
  _.set(
    req.query,
    'include[trainer_course][include][projects][include][project_quotes][include][quote][include][quoteProduct][q][main_id][eq]',
    null,
  );

  _.set(req.query, 'include[trainer_user]', 'all');
  _.set(req.query, 'include[trainer_user]include[trainer]', 'all');
  _.set(req.query, 'include[trainer_user][required]', true);
}

export async function handleAllInvoice(req: Request) {
  if (req?.query?.slug) {
    _.set(req.query, 'q[slug]', req?.query?.slug);
  }
  if (req?.query?.status) {
    _.set(req.query, 'q[payment_status][in]', (req?.query?.status as string).split(','));
  }
  if (!_.isUndefined(req?.query?.startDueDate) && !_.isUndefined(req?.query?.endDueDate)) {
    _.set(req?.query, 'q[due_date][between]', [
      new Date(String(req?.query?.startDueDate)),
      new Date(String(req?.query?.endDueDate)),
    ]);
  }
  if (!_.isUndefined(req?.query?.startInvoiceDate) && !_.isUndefined(req?.query?.endInvoiceDate)) {
    _.set(req?.query, 'q[invoice_date][between]', [
      new Date(String(req?.query?.startInvoiceDate)),
      new Date(String(req?.query?.endInvoiceDate)),
    ]);
  }
  _.set(req.query, 'include[invoice_product]', 'all');

  _.set(req.query, 'include[invoice_product]include[order]q[language]', req?.language);
  _.set(req.query, 'include[invoice_product]include[order]', 'order_number');
  _.set(req.query, 'include[invoice_product]include[company][select]', 'id,name,logo');
  _.set(req.query, 'include[invoice_product]include[company]required', true);
  if (req?.query?.companies) {
    _.set(
      req.query,
      'include[invoice_product]include[company][q][name][in]',
      (req?.query?.companies as string).split(','),
    );
  }
  _.set(req.query, 'include[invoice_product]include[course]', 'all');
  _.set(req.query, 'include[invoice_product]include[product]', 'all');
  // _.set(req.query, 'include[invoice_product]include[product]required', true);
  _.set(req.query, 'include[invoice_product]include[payment_terms]', 'all');
  _.set(req.query, 'sort', '-id');
}

// export async function handleAllInvoiceAcademicProduct(req: Request) {
//   _.set(req.query, 'include[order][q][type]', OrderStatusType.Academic);
//   _.set(req.query, 'include[order][required]', true);
//   _.set(req.query, 'include[company]', 'all');
//   _.set(req.query, 'include[course]', 'all');
//   _.set(req.query, 'sort', '-id');
// }

export async function getAllTrainerNotes(req: Request) {
  if (req?.query?.userId) {
    _.set(req.query, 'q[trainer_id]', req?.query?.userId);
  }
  if (req?.query?.roleId) {
    _.set(req.query, 'q[created_by]', req?.query?.roleId);
  }
  _.set(req.query, 'sort', '-id');
}

// export async function handleOrderDropdown(req: Request) {
//   _.set(req.query, 'q[language]', req?.language);
//   _.set(req?.query, 'status[in]', [OrderStatus.Open, OrderStatus.PartiallyClosed]);
//   if (!_.isUndefined(req?.query.dropdown)) _.set(req?.query, 'label', 'order_number');
//   if (!_.isUndefined(req?.query.company_id)) _.set(req?.query, 'q[company_id]', req?.query.company_id);
// }

// export async function handleAllOrder(req: Request) {
//   _.set(req.query, 'q[language]', LanguageEnum.italian);
//   if (req?.query?.type) {
//     _.set(req.query, 'q[type][in]', (req?.query?.type as string).split(','));
//   }
//   if (req?.query?.status) {
//     _.set(req.query, 'q[status][in]', (req?.query?.status as string).split(','));
//   }
//   if (req?.query?.orderType) {
//     _.set(req.query, 'q[order_type][in]', (req?.query?.orderType as string).split(','));
//   }
//   _.set(req.query, 'include[company]', 'all');

//   _.set(req.query, 'include[quotes]', 'all');
//   if (req?.query?.search) _.set(req.query, 'include[quotes][q][quote_number][like]', `${req?.query?.search}`);
//   _.set(req.query, 'include[quotes]include[company]', 'all');
//   _.set(req.query, 'include[course]', 'all');
//   _.set(req.query, 'include[course]include[courseCategory]', 'name');
//   _.set(req.query, 'include[course]include[enrolled_courses]', 'all');
//   _.set(req.query, 'include[course]include[enrolled_courses]include[company][select]', 'id');
//   _.set(
//     req.query,
//     'include[course]include[enrolled_courses]include[company]include[course_participates]q[language]',
//     req?.language,
//   );
//   _.set(
//     req.query,
//     'include[course]include[enrolled_courses]include[company]include[course_participates]',
//     'first_name,last_name,code',
//   );
//   _.set(req.query, 'include[quotes]include[quoteProduct]', 'all');
//   _.set(req.query, 'include[quotes]include[quoteProduct]include[codes][select]', 'code');

//   _.set(req.query, 'include[quotes]include[company]', 'all');
//   _.set(req.query, 'include[payment_terms]', 'all');
//   _.set(req.query, 'sort', '-id');
//   if (req?.query?.slug) {
//     _.set(req.query, '[q]slug', req?.query?.slug);
//     _.set(req.query, 'include[client_purchase_order]sort', '-id');
//     _.set(req.query, 'include[order_attachment]sort', '-id');
//     _.set(req.query, 'include[order_comment]sort', '-id');
//     _.set(req.query, 'include[order_comment]include[orderUser]', 'all');
//   }
// }

// export async function handleAllPaymentTerms(req: Request) {
//   if (req?.query?.companyDropdown) {
//     _.set(req.query, 'q[language]', LanguageEnum.italian);
//   } else _.set(req.query, 'q[language]', req?.language);
//   _.set(req.query, 'sort', '-id');
// }
export async function handleAllAccessPermission(req: Request) {
  _.set(req.query, 'include[user][select]', 'id,username');
  _.set(req.query, 'include[user][required]', true);
  _.set(req.query, 'include[user][include][role]', 'id,name');

  if (!_.isUndefined(req?.query?.course_bundle_slug)) {
    _.set(req?.query, 'q[course_id][eq]', null);
    _.set(req.query, 'include[course_bundle][q]slug', req?.query?.course_bundle_slug);
    _.set(req.query, 'include[course_bundle][select]', 'id,slug');
    _.set(req.query, 'include[course_bundle]required', true);
  }
  if (!_.isUndefined(req?.query?.course_slug)) {
    _.set(req?.query, 'q[language]', req?.language);
    _.set(req.query, 'include[course][select]', 'id,title,slug');
    _.set(req.query, 'include[course][q]slug', req?.query?.course_slug);
    _.set(req.query, 'include[course]required', true);
  }
  if (!_.isUndefined(req?.query?.survey_template_slug)) {
    _.set(req?.query, 'q[language]', req?.language);
    _.set(req.query, 'include[survey_template][q]slug', req?.query?.survey_template_slug);
    _.set(req.query, 'include[survey_template][select]', 'id,slug');
    _.set(req.query, 'include[survey_template]required', true);
  }
}
export async function handleAllProjectCardMembers(req: Request) {
  _.set(req?.query, '[q][slug]', req?.params?.project_slug);
  _.set(req?.query, 'include[card]', 'all');
  _.set(req?.query, 'include[card]include[card_members]', 'all');
}

export async function handleAllCourseCategory(req: Request) {
  if (req.query.member && req.query.isCard) {
    _.set(req?.query, 'include[courses]', 'all');
    _.set(req?.query, 'include[courses][required]', true);
    _.set(req?.query, 'include[courses]q[is_template]', false);
    _.set(req?.query, 'include[courses]include[card]', 'all');
    _.set(req?.query, 'include[courses]include[card][required]', true);
    _.set(req?.query, 'include[courses]include[card][include][card_members]', 'all');
    _.set(req?.query, 'include[courses]include[card][include][card_members][required]', true);
    _.set(req?.query, 'include[courses]include[card][include][card_members][q][user_id]', req?.query?.member);
  }
  if (req.query.member && req.query.isTrainer) {
    _.set(req?.query, 'include[courses]', 'all');
    _.set(req?.query, 'include[courses][required]', true);
    _.set(req?.query, 'include[courses]q[is_template]', false);
    _.set(req?.query, 'include[courses]include[lessons][select]', 'id,title,mode,date,slug,conference_provider');
    _.set(req?.query, 'include[courses]include[lessons]required', true);
    _.set(req?.query, 'include[courses]include[course_notes][select]', 'content');
    _.set(req?.query, 'include[courses]include[lessons][include][lesson_sessions][select]', 'id,start_time,end_time');
    _.set(req?.query, 'include[courses]include[lessons][include][lesson_sessions]required', true);
    // _.set(req?.query, 'include[lessons][include][lesson_sessions][q][assigned_to]', userId);
    _.set(
      req?.query,
      'include[courses]include[lessons][include][lesson_sessions][include][lessonSessionApproval][select]',
      'assigned_to_status',
    );
    _.set(
      req?.query,
      'include[courses]include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to]',
      req.query.member,
    );
    _.set(
      req?.query,
      'include[courses]include[lessons][include][lesson_sessions][include][lessonSessionApproval]required',
      true,
    );
  }
  if (req.query.status) {
    _.set(req?.query, 'include[courses]', 'all');
    _.set(req?.query, 'include[courses][q][is_template]', false);
    _.set(req?.query, 'include[courses][q][status][in]', (req?.query?.status as string).split(','));
    _.set(req?.query, 'include[courses][required]', true);
  }
  if (!_.isUndefined(req?.query.dropdown)) _.set(req?.query, 'label', 'name');
}

export async function handleAllParticipateCourses(req: Request) {
  if (req.query.participate_slug) _.set(req?.query, '[q]slug', req.query.participate_slug);
  if (req.query.course_slug) {
    _.set(req.query, 'include[course][q]slug', req?.query?.course_slug);
  }
  _.set(req.query, 'include[courseParticipateExam]', 'all');

  if (req.query.code) _.set(req?.query, '[q]slug', req.query.participate_slug);
  _.set(req.query, 'include[company]', 'all');
  _.set(req.query, 'include[course]', 'all');
  _.set(req.query, 'include[course]include[courseCategory]', 'all');

  if (req.query.slug) _.set(req?.query, '[q]slug', req.query.slug);
}

export async function handleAllCourseResources(req: Request) {
  if (!_.isUndefined(req?.query.dropdown)) _.set(req?.query, 'label', 'title');
}

export async function handleAllSubCourseCategory(req: Request) {
  if (!_.isUndefined(req?.query.dropdown)) _.set(req?.query, 'label', 'name');
  _.set(req?.query, 'include[surveyTemplate]select', 'slug');
  _.set(req?.query, 'include[certificateTemplate]select', 'slug');

  if (req?.query.category_slug) {
    _.set(req?.query, 'include[category][q][slug]', req?.query?.category_slug);
    _.set(req?.query, 'include[category]required', true);
  }
  if (req?.query.course) {
    _.set(req?.query, 'select', 'id,image,name');
    // _.set(req?.query, 'include[courses]', { required: true, limit: 1 });
    _.set(req?.query, 'include[courses]select', 'id,image,title');
    _.set(req?.query, 'include[courses][q][language]', req.language);
  }

  if (req?.query.category_id) {
    _.set(req?.query, '[q][category_id]', req?.query?.category_id);
    _.set(req?.query, 'include[category]required', true);
  } else {
    _.set(req?.query, 'include[category]', 'id,slug,name');
  }
  if (req?.query?.categoriesid) {
    _.set(req?.query, '[q][category_id][in]', (req?.query?.categoriesid as string).split(','));
    _.set(req?.query, 'include[category]required', true);
  }
}

// export async function handleSubCategoryFromCategory(req: Request) {
//   if (req?.query?.category_id && req.language != defaultLanguage) {
//     // parent
//     const data = await CourseCategory.findByPk(Number(req?.query?.category_id));
//     if (data) {
//       const categoryId = await CourseCategory.findOne({ where: { slug: parse(data).slug, language: req.language } });
//       _.set(req?.query, 'category_id', categoryId.id);
//     }
//   }
// }

export async function handleAllPrivateIndividualDetails(req: Request) {
  _.set(
    req.query,
    'select',
    'id,email,full_name,first_name,last_name,username,contact,profile_image,added_by,date_format,timezone,birth_date,gender,address1,address2,city,country,state,zip,active,verified,created_at,updated_at,role_id,',
  );
  _.set(req?.query, 'include[private_individual][select]', 'id,job_title,user_id,codice_fiscale');
}

export async function handlePrivateIndividualDetails(req: Request) {
  _.set(
    req.query,
    'select',
    'id,email,full_name,first_name,last_name,username,contact,profile_image,added_by,date_format,timezone,birth_date,gender,address1,address2,city,country,state,zip,active,verified,created_at,updated_at,role_id,created_at',
  );
  _.set(req?.query, 'include[private_individual][select]', 'id,job_title,user_id,codice_fiscale');
}

export async function handleAllNotifications(req: Request) {
  _.set(req?.query, 'q[user_id]', req?.tokenData.user.id);
}

export async function handleAllCalendarEvents(req: Request) {
  const userId = req?.query.user_id ? req?.query.user_id : req?.tokenData?.user?.id;
  _.set(req?.query, 'select', 'id,conference_provider,calendar_provider,start_time,end_time,course_id');
  _.set(req?.query, 'include[lesson][select]', 'id,title,mode,language,slug');
  _.set(req?.query, 'include[course][select]', 'id,start_date,end_date,title,assigned_to,slug,type,image');
  _.set(req?.query, 'include[course]include[lessons][select]', 'id');
  // _.set(req?.query, 'include[course][select]', 'id,start_date,end_date,title,assigned_to,slug,type');
  _.set(
    req.query,
    'include[course][include][assignedTo][select]',
    'id,full_name,first_name,last_name,email,contact,username,profile_image',
  );
  _.set(
    req.query,
    'include[course][include][lessonSessionApproval][select]',
    'id,assigned_to,assigned_to_status,trainer_assigned_to_status',
  );
  _.set(
    req?.query,
    'include[course][include][createdByUser][select]',
    'id,full_name,first_name,last_name,email,contact,username,profile_image',
  );
  _.set(req?.query, 'include[course][q][is_template]', false);
  _.set(req?.query, 'include[course]required', true);

  if (req?.query?.start_date && req?.query?.end_date) {
    _.set(req?.query, 'include[lesson][q][date][between]', [req.query.start_date, req.query.end_date]);
    _.set(req?.query, 'include[lesson]required', true);
  }
  // if (
  //   [RoleEnum.TrainingSpecialist, RoleEnum.Admin, RoleEnum.Trainer].includes(parse(req?.tokenData?.user)?.role_name)
  // ) {
  //   _.set(req.query, 'include[course][include][card][select]', 'stage_id');
  //   _.set(req.query, 'include[course][include][card]include[stage][select]', 'name');
  //   _.set(req?.query, 'include[course]include[card]include[stage]required', true);
  // } else {
  //   _.set(req?.query, 'include[course][q][status]', CourseStatus.publish);
  // }

  // if (parse(req?.tokenData?.user)?.role_name === RoleEnum.Trainer) {
  //   _.set(req?.query, 'include[course]include[lessons][select]', 'id');
  //   _.set(req?.query, 'include[course]include[lessons]required', true);
  //   _.set(req?.query, 'include[course]include[lessons][include][lesson_sessions][select]', 'id,start_time,end_time');
  //   _.set(req?.query, 'include[course]include[lessons][include][lesson_sessions]required', true);

  //   _.set(
  //     req?.query,
  //     'include[course]include[lessons][include][lesson_sessions][include][lessonSessionApproval][select]',
  //     'assigned_to_status',
  //   );
  //   // _.set(
  //   //   req?.query,
  //   //   'include[course]include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to_status]',
  //   //   AssignedStatus.Accepted,
  //   // );
  //   // _.set(
  //   //   req?.query,
  //   //   'include[course]include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to]',
  //   //   userId,
  //   // );
  //   _.set(
  //     req?.query,
  //     'include[course]include[lessons][include][lesson_sessions][include][lessonSessionApproval]required',
  //     true,
  //   );
  // }
  // if (parse(req?.tokenData?.user)?.role_name === RoleEnum.CompanyManager) {
  //   _.set(req?.query, 'include[course][include][enrolled_courses][select]', 'id,manager_id');
  //   _.set(req?.query, 'include[course][include][enrolled_courses][q][manager_id]', req?.tokenData?.user?.id);
  //   _.set(req?.query, 'include[course][include][enrolled_courses][required]', true);
  // }
  // if (parse(req?.tokenData?.user)?.role_name === RoleEnum.PrivateIndividual) {
  //   _.set(req?.query, 'include[course][include][enrolled_courses][select]', 'id,private_individual_id');
  //   _.set(
  //     req?.query,
  //     'include[course][include][enrolled_courses][q][private_individual_id][eq]',
  //     req?.tokenData?.user?.id,
  //   );

  //   _.set(req?.query, 'include[course][include][enrolled_courses][required]', true);
  // }
}

export async function handleCalendarEventDetail(req: Request) {
  _.set(
    req?.query,
    'select',
    'id,marked_as,type,mode,funded_by,code_id,academy_id,is_template,start_date,end_date,has_exam,card_id,project_id,image,status,title,code',
  );
  _.set(
    req?.query,
    'include[assignedTo][select]',
    'id,full_name,first_name,last_name,email,contact,username,profile_image',
  );
  _.set(
    req?.query,
    'include[createdByUser][select]',
    'id,full_name,first_name,last_name,email,contact,username,profile_image',
  );
  _.set(req?.query, 'include[courseCategory]', 'id,name');
  _.set(req?.query, 'include[courseSubCategory]', 'id,name');
  _.set(
    req?.query,
    'include[lessons]',
    'id,title,mode,conference_provider,calendar_provider,client_meeting_link,date,address_map_link,place_address,course_id',
  );
  if (req?.query.lesson_id) {
    _.set(req?.query, 'include[lessons][q][id]', req?.query.lesson_id);
  }
  _.set(
    req?.query,
    'include[lessons][include][lesson_sessions]',
    'id,lesson_id,calendar_provider_id,client_meeting_link,start_time,end_time,provider_meeting_link,provider_meeting_event_id,provider_start_meeting_link,provider_meeting_id,provider_meeting_additional_data,provider_meeting_request_uid,provider_event_uid,provider_event_additional_data',
  );
  _.set(req?.query, 'include[course_notes]', 'id,content,language');
  _.set(req?.query, 'include[course_resources][select]', 'id,resource_id');
  _.set(req?.query, 'include[course_resources]include[resources]', 'id,title,slug');
  _.set(req?.query, 'include[assigned_rooms][select]', 'id,room_id');
  _.set(req?.query, 'include[assigned_rooms]include[course_room]', 'id,title,slug');
}

export async function handleAllRoleWiseData(req: Request) {
  // Handle getAllRoleWiseData case
  if (
    _.isUndefined(req?.query?.ignore_is_active) ||
    (!_.isUndefined(req?.query?.ignore_is_active) && !req?.query?.ignore_is_active)
  )
    _.set(req?.query, 'q[active]', USER_STATUS.ACTIVE);
  if (req?.query.role) {
    _.set(req?.query, 'q[and][0][role_id][in]', (req?.query.role as string).split(','));
    _.set(req?.query, 'q[and][1][role_id][ne]', RoleEnum.Admin);
  } else {
    _.set(req?.query, 'q[and][0][role_id][ne]', RoleEnum.Admin);
  }
  if (req?.query?.dropdown) {
    // if (req?.query.label) _.set(req?.query, 'label', req?.query.label?req?.query.label:'fu');
  }

  if (req?.query.status) {
    _.set(req?.query, 'q[active][in]', (req?.query.status as string).split(','));
  }
  // if (!_.isUndefined(req?.query.is_head)) {
  //   _.set(
  //     req.query,
  //     'q[is_head][in]',
  //     String(req.query.is_head)
  //       .split(',')
  //       .map((str) => str === 'true'),
  //   );
  // }

  // _.set(req.query, 'q[is_head][in]', req.query.is_head.split(','))
  // _.set(req.query, 'q[is_head][in]', [req.query.is_head.split(',')])
  _.set(
    req.query,
    'select',
    'id,email,full_name,first_name,last_name,username,contact,profile_image,added_by,date_format,timezone,birth_date,gender,address1,address2,city,country,state,zip,active,verified,created_at,updated_at,role_id,is_head',
  );
  _.set(req?.query, 'include[trainer]', 'all');
  _.set(req?.query, 'include[trainer][include][trainerAttachment]', 'all');
  _.set(req?.query, 'include[trainer][include][trainerSubCategory]', 'all');
  _.set(req?.query, 'include[trainer][include][trainerSubCategory][include][sub_category]', 'all');
  _.set(req?.query, 'include[managers]', 'all');
  // _.set(req?.query, 'include[managers]include[company_manager]q[language]', req?.language);
  _.set(req?.query, 'include[managers]include[user][select]', 'username,id');

  _.set(req?.query, 'include[managers]include[company_manager]include[company][select]', 'name,id,slug');

  _.set(req?.query, 'include[role]', 'id,name');

  // _.set(req?.query, 'sort', '-card_members.id');
  _.set(req?.query, 'include[card_members][select]', 'id');
  _.set(req?.query, 'include[card_members][q][card_id]', 2);

  if (req?.query?.is_connection_user) {
    _.set(req?.query, 'include[userSocial]', '');
    _.set(req?.query, 'include[userSocial][q][token_provider][in]', [
      // TokenProvider.GOOGLE_CALENDAR,
      // TokenProvider.MICROSOFT_CALENDAR,
    ]);
    _.set(req?.query, 'include[userSocial][required]', true);
  }
}

export async function handleAllAssignedRoomResource(_req: Request) {}

export async function handleQuoteCompanyMailList(req: Request) {
  _.set(req?.query, '[q][id][in]', req?.query?.quote_ids);
  _.set(req?.query, 'include[company]', '');
  _.set(req?.query, 'include[company][include][company_manager]', '');
  _.set(req?.query, 'include[company][include][company_manager]include[manager]', '');
  _.set(req?.query, 'include[company][include][company_manager]include[manager]include[user]', '');
}

export async function handleAllCompanyDetails(req: Request) {
  // _.set(req.query, 'searchFields', 'name,registration_number,vat_number');
  _.set(
    req,
    'select',
    'id,uuid,user_id,name,legal_name,registration_number,slug,website,industry,description,size,logo,accounting_emails,ateco_code,sdi_code,vat_number,is_invoice,address1,address2,city,state,country,zip,address_province,ateco_id',
  );
  _.set(
    req.query,
    'include[user][select]',
    'id,email,full_name,first_name,last_name,username,contact,profile_image,address1,address2,city,state,country,zip',
  );

  if (req?.query?.project_id) {
    _.set(req.query, 'include[cardCompany][select]', 'is_default');
    _.set(req.query, 'include[cardCompany][q][project_id]', Number(req?.query?.project_id));
  }
}

export async function handleAllChatUsers(req: Request) {
  _.set(
    req.query,
    'select',
    'id,email,full_name,first_name,last_name,chat_user_status,username,contact,profile_image,added_by,date_format,timezone,birth_date,gender,address1,address2,city,country,state,zip,active,verified,created_at,updated_at,role_id',
  );
  _.set(req.query, 'q[active]', USER_STATUS.ACTIVE);
  _.set(req?.query, '[q][id][ne]', req?.tokenData.user.id);
  _.set(req?.query, 'include[role]', 'id,name');
  _.set(req?.query, 'include[role][required]', true);
  _.set(req?.query, 'include[role][q][name][notIn]', [
    RoleEnum.Admin,
    // RoleEnum.CompanyManager,
    // RoleEnum.Trainer,
    // RoleEnum.CMSUser,
    // RoleEnum.Accounting,
    // RoleEnum.Company,
    // RoleEnum.PrivateIndividual,
  ]);
}

export async function handleAllEmailTemplate(req: Request) {
  _.set(req.query, 'searchFields', 'title');
  _.set(req?.query, 'include[Attachment]', 'id');
}

export async function handleAllSentMail(req: Request) {
  _.set(req.query, 'searchFields', 'subject,to');
  _.set(req?.query, 'select', 'id,title,subject,description,from,to,cc,bcc,slug,created_by');
}

export async function handleRoomUser(req: Request) {
  _.set(req?.query, 'q[user_id]', req?.query.userId);
  _.set(req?.query, 'include[userRoom]', 'id,image,is_group_chat,name,is_active,slug,creator_id');
  _.set(req?.query, 'select', 'user_id,room_id');
}

export async function handleRoomInfo(req: Request) {
  _.set(req?.query, 'include[userRoom]', 'id,image,is_group_chat,name,is_active,slug,creator_id');
  if (req?.query.roomIds) _.set(req?.query, 'q[room_id][in]', req?.query.roomIds);
  _.set(req?.query, '[q][user_id][ne]', req?.query.userId);
  _.set(
    req?.query,
    'include[creatorUser]',
    'id,first_name,last_name,username,profile_image,verified,chat_user_status,full_name',
  );
}

export async function handleChatList(req: Request) {
  if (req?.query.room_id) _.set(req?.query, 'q[room_id]', req?.query.room_id);
  _.set(req?.query, 'q[parent_message_id]', '');
  _.set(req?.query, 'select', 'id,text,media,media_type,sender_id,room_id,parent_message_id,created_at,updated_at');
  _.set(
    req?.query,
    'include[parentMessage]',
    'id,text,media,media_type,sender_id,room_id,parent_message_id,created_at,updated_at',
  );
  _.set(req?.query, 'include[messageRoom][include][roomUsers][select]', 'id');
  _.set(req?.query, 'include[sender]', 'id,username,profile_image,verified');
}

export async function handleCompanyDetails(req: Request) {
  // Handle getCompanyDetails case
  _.set(
    req.query,
    'select',
    'id,uuid,user_id,name,legal_name,registration_number,slug,website,industry,description,size,logo,accounting_emails,ateco_code,sdi_code,vat_number,is_invoice,address1,address2,city,state,country,zip,payment_term_id,vat_type,address_province,ateco_id',
  );
  _.set(
    req.query,
    'include[user]',
    'id,email,full_name,first_name,last_name,username,contact,profile_image,address1,address2,city,state,country,zip',
  );
  _.set(
    req.query,
    'include[sales_rep]',
    'id,email,full_name,first_name,last_name,username,contact,profile_image,address1,address2,city,state,country,zip',
  );
  _.set(req?.query, 'include[company_manager][select]', 'id,company_id,manager_id');

  _.set(req?.query, 'include[company_manager][include][manager][select]', 'id,user_id,job_title');
  _.set(
    req?.query,
    'include[company_manager][include][manager][include][user][select]',
    'id,email,full_name,first_name,last_name,username,contact',
  );
  _.set(req?.query, 'include[company_payment]', 'all');
  _.set(req?.query, 'include[company_payment]include[child]', 'all');
}

export async function handleUsersNotInCompanyProvided(req: Request) {
  // Handle getUsersNotInCompanyProvided case
  _.set(req?.query, 'q[role_id]', req?.query.roleId);
  _.set(
    req,
    'select',
    'id,email,full_name,first_name,last_name,username,contact,profile_image,address1,address2,city,state,country,zip',
  );
  _.set(req?.query, 'include[managers][select]', 'id,user_id,job_title');
  _.set(req?.query, 'include[managers][include][company_manager][select]', 'id,manager_id,company_id');
}

export async function getAllCompanyCourses(req: Request) {
  _.set(req?.query, 'include[EnrolledCourse]', 'all');
  _.set(req?.query, 'include[EnrolledCourse]required', true);
  _.set(req?.query, 'include[EnrolledCourse]include[Company]', 'all');
  _.set(req?.query, 'include[EnrolledCourse]include[Company]include[CourseParticipates]', 'all');
  _.set(
    req?.query,
    'include[EnrolledCourse]include[Company]include[CourseParticipates][include][recoveredFromParticipate]',
    'all',
  );
}

export async function handleAllInternalEvents(req: Request) {
  _.set(
    req,
    'select',
    'id,topic,start_date,end_date,agenda,slug,status,conference_provider,calendar_provider,meeting_event_id,meeting_link,meeting_start_link,meeting_id,meeting_additional_data,meeting_request_uid,event_uid,event_id,event_additional_data,conference_change_key,calendar_change_key',
  );
  _.set(req?.query, 'include[createdByUser]', 'id,full_name,first_name,last_name,email,contact,username,profile_image');
  _.set(req?.query, 'include[organizer]', 'id,full_name,first_name,last_name,email,contact,username,profile_image');
  _.set(req?.query, 'include[conference_provider][select]', 'id,token_provider,token_provider_mail');
  _.set(req?.query, 'include[calendar_provider][select]', 'id,token_provider,token_provider_mail');
}

export async function handleInternalEventDetail(req: Request) {
  _.set(
    req,
    'select',
    'id,topic,start_date,end_date,agenda,slug,status,conference_provider,calendar_provider,meeting_event_id,meeting_link,meeting_start_link,meeting_id,meeting_additional_data,meeting_request_uid,event_uid,event_id,event_additional_data,conference_change_key,calendar_change_key,created_at',
  );
  _.set(req?.query, 'include[createdByUser]', 'id,full_name,first_name,last_name,email,contact,username,profile_image');
  _.set(req?.query, 'include[organizer]', 'id,full_name,first_name,last_name,email,contact,username,profile_image');
  _.set(req?.query, 'include[conference_provider][select]', 'id,token_provider,token_provider_mail');
  _.set(req?.query, 'include[calendar_provider][select]', 'id,token_provider,token_provider_mail');
}

export async function handleUserSocialAccounts(req: Request) {
  _.set(req.query, 'q[or][0][user_id]', req.tokenData?.user?.id);
  if (req.query.default) {
    _.set(req.query, 'q[or][1][is_default]', true);
    _.set(req.query, 'q[token_provider][in]', [
      // TokenProvider.GOOGLE_CALENDAR,
      // TokenProvider.MICROSOFT_CALENDAR,
      // TokenProvider.ZOOM,
    ]);
  }
  // if (req.query.calendar)
  //   _.set(req.query, 'q[token_provider][in]', [
  //     TokenProvider.GOOGLE_CALENDAR,
  //     TokenProvider.MICROSOFT_CALENDAR,
  //     TokenProvider.ICALENDAR,
  //   ]);

  _.set(req?.query, 'select', 'id,token_provider,token_provider_mail');
}

export async function handleCourseFilter(req: Request) {
  const userId = req?.query.user_id ? req?.query.user_id : req?.tokenData?.user?.id;
  // _.set(req.query, 'q[status]', CourseStatus.publish);
  _.set(req.query, 'select', 'id,slug,start_date,end_date,title,image');

  _.set(req?.query, 'include[lessons][select]', 'id');
  _.set(req?.query, 'include[lessons]required', true);
  _.set(req?.query, 'include[lessons][include][lesson_sessions][select]', 'id,start_time,end_time');
  _.set(req?.query, 'include[lessons][include][lesson_sessions][q][start_time][between]', [
    req.query.start_date,
    req.query.end_date,
  ]);
  _.set(req?.query, 'include[lessons][include][lesson_sessions]required', true);
  // if (parse(req?.tokenData?.user)?.role_name === RoleEnum.Trainer) {
  //   _.set(
  //     req?.query,
  //     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][select]',
  //     'assigned_to_status',
  //   );
  //   _.set(
  //     req?.query,
  //     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to_status]',
  //     AssignedStatus.Accepted,
  //   );
  //   _.set(
  //     req?.query,
  //     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to]',
  //     userId,
  //   );
  //   _.set(req?.query, 'include[lessons][include][lesson_sessions][include][lessonSessionApproval]required', true);
  // }
  // if (parse(req?.tokenData?.user)?.role_name === RoleEnum.CompanyManager) {
  //   _.set(req?.query, '[include][enrolled_courses][select]', 'id');
  //   _.set(req?.query, '[include][enrolled_courses][required]', true);
  // }
  // if (parse(req?.tokenData?.user)?.role_name === RoleEnum.PrivateIndividual) {
  //   _.set(req?.query, '[include][enrolled_courses][select]', 'id');
  //   _.set(req?.query, '[include][enrolled_courses][required]', true);
  // }
}

export async function handleAllCourse(req: Request) {
  if (req?.query?.filterView) {
    _.set(req?.query, 'select', 'id,slug,title,image,start_date,end_date,max_attendee_applicable');
    _.set(req?.query, 'q[is_template]', false);
  } else {
    if (req?.query?.tableView) await handleCourseV2(req);
    else {
      _.set(req?.query, 'q[is_template]', false);
      _.set(req?.query, 'include[access]', 'user_id,delete,edit,view');
      if (req?.query?.status) _.set(req?.query, 'q[status]', req?.query?.status);
      // if (_.isUndefined(req.query.bundle_data) || _.isUndefined(req.query.course_bundle_id))
      //   _.set(req?.query, 'q[course_bundle_id]', '');
      _.set(req?.query, 'include[academy][select]', 'name,address_map_link,address');

      _.set(req?.query, 'include[surveyTemplate][select]', 'title,note');

      _.set(req?.query, 'include[certificateTemplate][select]', 'title,note');

      _.set(
        req?.query,
        'include[assigned_rooms]select',
        'room_id,id,course_id,course_bundle_id,room_id,assigned_to,is_optional,assigned_to_status',
      );

      _.set(req?.query, 'include[assigned_rooms]include[course_room]select', 'title,maximum_participate,slug');
      _.set(req?.query, 'include[course_resources]', 'all');
      _.set(req?.query, 'include[course_resources]include[resources]', 'title');
      _.set(req?.query, 'include[course_participates][select]', 'id,first_name,last_name,slug,email,code,job_title');
      _.set(req?.query, 'include[projects]select', 'title');

      _.set(
        req?.query,
        '[include][lessonSessionApproval]select',
        'assigned_to_status,is_full_course,course_id,lesson_session_id,is_optional,is_lesson_trainer',
      );
      _.set(
        req?.query,
        'include[lessonSessionApproval][include][assignedToUser]select',
        'first_name,last_name,id,profile_image',
      );
      _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources]', 'all');
      _.set(
        req?.query,
        'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][courseRoom]',
        'all',
      );
      _.set(
        req?.query,
        'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][resource]',
        'all',
      );
      _.set(
        req?.query,
        'select',
        'id,is_external_certificate,validity,title,slug,description,type,duration,code,marked_as,is_template,start_date,end_date,has_exam,need_digital_attendance_sheet,founded,funded_by,reject_reason,meeting_room_number,maximum_participate_allowed,price,price_in,certificate_pdf_link,maximum_participation_attendance,image,status,course_template_id,category_id,cloned_course_id,sub_category_id,,created_by,assigned_to,created_at,updated_at,deleted_at,academy_id,code_id,survey_template_id,created_by,certificate_title,certificate_template_id,course_bundle_id,project_id,max_attendee_applicable,survey_qr,survey_url',
      );
      _.set(req?.query, 'include[lessons]', 'all');
      _.set(req?.query, 'include[lessons]include[topics]', 'all');
      _.set(req?.query, 'include[createdByUser]select', 'first_name,last_name');
      _.set(req?.query, 'include[createdByUser][include][role]', 'name');
      _.set(req?.query, 'include[lessons][include][lesson_resources]', 'all');
      _.set(req?.query, 'include[courseCategory]', 'all');
      _.set(req?.query, 'include[courseSubCategory]', 'all');
      _.set(req?.query, 'include[course_notes]', 'all');
      _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
      _.set(
        req?.query,
        'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
        'assigned_to_status,is_full_course,course_id,lesson_session_id,is_optional',
      );
      _.set(
        req?.query,
        'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser]select',
        'first_name,last_name,id',
      );
      _.set(req?.query, 'include[exam]', 'all');
      _.set(req?.query, 'include[exam][include][questions]', 'all');
      _.set(req?.query, 'include[exam][include][questions][include][answers]', 'all');

      if (!_.isUndefined(req.query.courseCategory)) {
        _.set(req?.query, 'include[courseCategory][q][slug][in]', String(req.query.courseCategory).split(','));
        _.set(req?.query, 'include[courseCategory][required]', true);
      }
    }
  }
}

export async function handleAllAssignedTrainersOfCourse(req: Request) {
  _.set(req?.query, 'q[is_template]', false);

  _.set(
    req?.query,
    '[include][lessonSessionApproval]select',
    'assigned_to_status,is_full_course,course_id,lesson_session_id,is_optional,is_lesson_trainer,available',
  );
  _.set(
    req?.query,
    'include[lessonSessionApproval][include][assignedToUser]select',
    'first_name,last_name,id,profile_image',
  );
  _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources]', 'all');
  _.set(
    req?.query,
    'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][courseRoom]',
    'all',
  );
  _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][resource]', 'all');
  _.set(req?.query, 'select', 'id,title');
  _.set(req?.query, 'include[lessons]', 'all');
  _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
  _.set(
    req?.query,
    'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
    'assigned_to_status,is_full_course,course_id,lesson_session_id,is_optional,available',
  );
  _.set(
    req?.query,
    'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser]select',
    'first_name,last_name,id',
  );
}

export async function handleCourseV2(req: Request) {
  _.set(req?.query, 'q[is_template]', false);
  _.set(req?.query, 'include[access]', 'user_id,delete,edit');
  if (req?.query?.status) _.set(req?.query, 'q[status][in]', (req?.query?.status as string).split(','));
  if (_.isUndefined(req.query.bundle_data) || _.isUndefined(req.query.course_bundle_id))
    _.set(req?.query, 'q[course_bundle_id]', '');

  if (req?.query?.course_type) {
    _.set(req?.query, 'q[type][in]', (req?.query?.course_type as string).split(','));
  }

  _.set(req?.query, 'include[projects]', 'all');
  _.set(req?.query, 'include[projects]include[card]', 'all');
  _.set(req?.query, 'include[projects]include[card][include][card_Company]', 'all');
  _.set(req?.query, 'include[projects]include[card][include][card_Company][include][company]', 'all');

  if (req?.query?.companies) {
    _.set(req?.query, 'include[projects][required]', true);
    _.set(req?.query, 'include[projects][include][quotes]', 'all');
    _.set(req?.query, 'include[projects][include][quotes][include][company]', 'all');
    _.set(
      req?.query,
      'include[projects][include][quotes][include][company][q][id][in]',
      (req?.query?.companies as string).split(','),
    );
  }
  _.set(req?.query, 'include[assigned_rooms]', 'all');
  _.set(req?.query, 'include[assigned_rooms]include[course_room]', 'all');
  _.set(req?.query, 'include[course_resources]', 'all');
  _.set(req?.query, 'include[course_resources]include[resources]', 'title');

  _.set(
    req?.query,
    'select',
    'id,is_external_certificate,title,slug,type,code,marked_as,start_date,end_date,founded,funded_by,image,status,created_by,updated_by,certificate_title,certificate_template_id,,course_bundle_id,project_id,max_attendee_applicable',
  );

  _.set(
    req?.query,
    '[include][lessonSessionApproval]select',
    'assigned_to_status,is_full_course,course_id,lesson_session_id,is_optional',
  );

  _.set(req?.query, 'include[card][select]', 'id,title,slug');
  _.set(req?.query, 'include[card][include][card_members][select]', 'id,user_id,card_id');
  _.set(req?.query, 'include[card][include][card_Company][select]', 'id,company_id,card_id');
  _.set(req?.query, 'include[card][include][card_Company][include][company]', 'id,name');
  _.set(
    req,
    'include[card][include][card_members][include][member][select]',
    'id,first_name,last_name,email,contact,profile_image,username',
  );

  _.set(req?.query, 'include[lessonSessionApproval][include][assignedToUser]select', 'first_name,last_name,id');
  _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources]', 'all');
  _.set(
    req?.query,
    'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][courseRoom]',
    'all',
  );
  _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][resource]', 'all');

  // _.set(req?.query, 'include[lessons]', 'all');
  // _.set(req?.query, 'include[lessons][include][lesson_resources]', 'all');

  _.set(req?.query, 'include[createdByUser]select', 'first_name,last_name');
  _.set(req?.query, 'include[createdByUser][include][role]', 'name');

  if (req?.query?.trainingSpecialist) {
    _.set(req?.query, 'include[createdByUser][q][id][in]', (req?.query?.trainingSpecialist as string).split(','));
    _.set(req?.query, 'include[createdByUser][required]', true);
  }
  _.set(req?.query, 'include[courseCategory]', 'name');

  if (req?.query?.courseCategory) {
    _.set(req?.query, 'include[courseCategory][q][slug][in]', (req?.query?.courseCategory as string).split(','));
    _.set(req?.query, 'include[courseCategory][required]', true);
  }
  _.set(req?.query, 'include[courseSubCategory]', 'name');

  // _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
  _.set(
    req?.query,
    'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
    'assigned_to_status,is_full_course,course_id,lesson_session_id,is_optional',
  );
  _.set(
    req?.query,
    'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser]select',
    'first_name,last_name,id',
  );
  // _.set(req?.query, 'include[exam]', 'all');
  // _.set(req?.query, 'include[exam][include][questions]', 'all');
  // _.set(req?.query, 'include[exam][include][questions][include][answers]', 'all');
}

//handleAllCourseMembers

export async function handleAllCourseMembers(req: Request) {
  // if (req?.query?.member) {

  if (!_.isUndefined(req.query.type)) {
    _.set(req?.query, 'q[type][in]', String(req.query.type).split(','));
  }
  if (!_.isUndefined(req.query.status)) {
    _.set(req?.query, 'q[status][in]', String(req.query.status).split(','));
  }
  _.set(req?.query, 'q[is_template]', false);
  _.set(req?.query, 'include[card]', 'all');
  _.set(req?.query, 'include[card][required]', true);
  _.set(req?.query, 'include[card][include][card_members]', 'all');
  _.set(req?.query, 'include[card][include][card_members][required]', true);
  _.set(req?.query, 'include[card][include][card_members][q][user_id]', req?.query?.member);
  if (_.isUndefined(req.query.bundle_data) || _.isUndefined(req.query.course_bundle_id))
    _.set(req?.query, 'q[course_bundle_id]', '');

  _.set(
    req?.query,
    '[include][lessonSessionApproval]select',
    'assigned_to_status,is_full_course,course_id,course_id,lesson_session_id,is_optional',
  );
  _.set(req?.query, 'include[lessonSessionApproval][include][assignedToUser]select', 'first_name,last_name,id');
  _.set(
    req?.query,
    'select',
    'id,validity,title,slug,description,type,duration,code,marked_as,is_template,start_date,end_date,has_exam,need_digital_attendance_sheet,founded,funded_by,reject_reason,meeting_room_number,maximum_participate_allowed,price,price_in,certificate_pdf_link,maximum_participation_attendance,image,status,course_template_id,category_id,cloned_course_id,sub_category_id,created_by,assigned_to,created_at,updated_at,deleted_at,academy_id,code_id,certificate_title,certificate_template_id',
  );
  // _.set(req?.query, 'include[card_members][q][user_id]', req?.query?.member);
  _.set(req?.query, 'include[lessons]', 'all');
  _.set(req?.query, 'include[createdByUser]select', 'first_name,last_name');
  _.set(req?.query, 'include[createdByUser][include][role]', 'name');
  _.set(req?.query, 'include[lessons][include][lesson_resources]', 'all');
  _.set(req?.query, 'include[courseCategory]', 'all');
  _.set(req?.query, 'include[courseSubCategory]', 'all');
  _.set(req?.query, 'include[course_notes]', 'all');
  _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
  _.set(
    req?.query,
    'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
    'assigned_to_status,is_full_course,course_id,course_id,lesson_session_id,is_optional',
  );
  _.set(
    req?.query,
    'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser]select',
    'first_name,last_name,id',
  );
  _.set(req?.query, 'include[exam]', 'all');
  _.set(req?.query, 'include[exam][include][questions]', 'all');
  _.set(req?.query, 'include[exam][include][questions][include][answers]', 'all');
  if (!_.isUndefined(req.query.courseCategory)) {
    _.set(req?.query, 'include[courseCategory][q][slug][in]', String(req.query.courseCategory).split(','));
    _.set(req?.query, 'include[courseCategory][required]', true);
  }
  // }
}
// export async function handleAllPublishedCourse(req: Request) {
//   const dateObj = new Date();
//   _.set(req.query, '[q][end_date][gte]', dateObj.setDate(dateObj.getDate() - 1));
//   _.set(req.query, '[q]status', CourseStatus.publish);
// }

// export async function handleAllCourseData(req: Request) {
//   _.set(req?.query, 'q[is_template]', true);
//   _.set(
//     req?.query,
//     'select',
//     'id,validity,title,slug,description,type,duration,code,marked_as,is_template,start_date,end_date,has_exam,need_digital_attendance_sheet,founded,funded_by,reject_reason,meeting_room_number,maximum_participate_allowed,price,price_in,certificate_pdf_link,maximum_participation_attendance,image,status,course_template_id,category_id,cloned_course_id,sub_category_id,language,parent_table_id,created_by,assigned_to,created_at,updated_at,deleted_at,academy_id,code_id',
//   );
//   if (req?.query?.status) _.set(req?.query, 'q[status]', req?.query?.status);

//   _.set(req?.query, 'include[lessons]', 'all');
//   _.set(req?.query, 'include[createdByUser]select', 'first_name,last_name');
//   _.set(req?.query, 'include[createdByUser][include][role]', 'name');
//   _.set(req?.query, 'include[lessons][include][lesson_resources]', 'all');
//   _.set(req?.query, 'include[lessons][include][topics]', 'all');
//   _.set(req?.query, 'include[courseCategory]', 'all');
//   _.set(req?.query, 'include[courseSubCategory]', 'all');
//   _.set(req?.query, 'include[course_notes]', 'all');
//   _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
//     'assigned_to_status,is_full_course,course_id,course_id,lesson_session_id',
//   );
//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser]select',
//     'first_name,last_name',
//   );
//   _.set(req?.query, 'include[exam]', 'all');
//   _.set(req?.query, 'include[exam][include][questions]', 'all');
//   _.set(req?.query, 'include[exam][include][questions][include][answers]', 'all');
// }

// export async function handleAllCourseManager(req: Request) {
//   if (!_.isUndefined(req.query.course_slug)) _.set(req?.query, 'q[slug]', req.query.course_slug);
//   if (!_.isUndefined(req.query.course_to_ignore))
//     _.set(req?.query, 'q[slug][notIn]', String(req.query.course_to_ignore).split(','));
//   _.set(req?.query, 'q[is_template]', false);
//   if (!_.isUndefined(req.query.type) && req.query.type === CourseType.Academy) {
//     _.set(req?.query, 'q[status][in]', [CourseStatus.publish]);
//   } else if (!_.isUndefined(req.query.type) && req.query.type === CourseType.Private) {
//     _.set(req?.query, 'q[status][in]', [CourseStatus.publish, CourseStatus.draft, CourseStatus.on_stand_by]);
//   } else if (_.isUndefined(req.query.type)) {
//     _.set(req?.query, 'q[status][in]', [CourseStatus.publish]);
//   }
//   _.set(req?.query, 'q[end_date][gte]', new Date().setDate(new Date().getDate() - 1));
//   _.set(
//     req?.query,
//     'select',
//     'id,title,slug,duration,marked_as,start_date,end_date,has_exam,price,price_in,image,category_id,sub_category_id,language,parent_table_id,validity,maximum_participate_allowed,founded,funded_by,course_bundle_id,status,type',
//   );

//   if (!_.isUndefined(req.query.courseCategory)) {
//     _.set(req?.query, 'q[category_id][in]', String(req.query.courseCategory).split(','));
//   }

//   if (!_.isUndefined(req.query.type)) {
//     _.set(req?.query, 'q[type][in]', String(req.query.type).split(','));
//   }
//   if (!_.isUndefined(req.query.courseSubCategory)) {
//     _.set(req?.query, '[q][sub_category_id][in]', String(req.query.courseSubCategory).split(','));
//   }
//   if (!_.isUndefined(req.query.startDate) && !_.isUndefined(req.query.endDate)) {
//     _.set(req?.query, 'q[start_date][between]', [
//       new Date(String(req.query.startDate)),
//       new Date(String(req.query.endDate)),
//     ]);

//     _.set(req?.query, 'q[end_date][between]', [
//       new Date(String(req.query.startDate)),
//       new Date(String(req.query.endDate)),
//     ]);
//   }

//   if (!_.isUndefined(req.query.status)) {
//     _.set(req?.query, 'q[status][in]', String(req.query.status).split(','));
//   }

//   if (!_.isUndefined(req.query.marked_as)) {
//     const markedAsValues = String(req.query.marked_as).split(',');
//     if (
//       markedAsValues.includes(CourseMarkAsEnum.SoldOut) ||
//       markedAsValues.includes(CourseMarkAsEnum.TemporarySoldOut)
//     ) {
//       _.set(req.query, 'q[marked_as][in]', markedAsValues);
//     } else {
//       _.set(req.query, 'q[marked_as][notIn]', ['sold_out', 'temporary_sold_out']);
//     }
//   }
//   _.set(req?.query, 'include[courseCategory][select]', 'id,name,slug');
//   _.set(req?.query, 'include[courseSubCategory][select]', 'id,name,slug');

//   _.set(req?.query, 'include[createdByUser][select]', 'first_name,last_name');

//   if (!_.isUndefined(req.query.detailedView)) {
//     _.set(req?.query, 'include[codes][select]', 'code');
//     _.set(req?.query, 'include[card][select]', 'id');
//     _.set(
//       req?.query,
//       'include[card][include][card_attachments][select]',
//       'attachment_url,attachment_type,is_funded_documents,show_company_manager',
//     );

//     _.set(req?.query, 'include[projects][select]', 'id');
//     _.set(req?.query, 'include[projects]include[card][select]', 'id');

//     _.set(
//       req?.query,
//       'include[projects]include[card][include][card_attachments][select]',
//       'attachment_url,attachment_type,is_funded_documents',
//     );

//     _.set(req?.query, 'include[lessons][include][lesson_resources][select]', 'id');
//     _.set(req?.query, 'include[course_notes][select]', 'content');
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][select]',
//       'id,start_time,end_time,conference_provider',
//     );
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser][select]',
//       'first_name,last_name',
//     );

//     _.set(req?.query, 'include[enrolled_courses]', 'all');
//     if (req?.query?.company_id) {
//       _.set(req?.query, 'include[enrolled_courses][q][company_id]', req.query?.company_id);
//     }
//   }
// }

// export async function handleRoomResourceOfCourse(req: Request) {
//   if (!_.isUndefined(req.query.course_slug)) _.set(req?.query, 'q[slug]', req.query.course_slug);
//   if (!_.isUndefined(req.query.bundle_slug)) {
//     _.set(req?.query, 'q[slug]', req.query.bundle_slug);
//   }
//   _.set(req?.query, 'include[course_resources]', 'all');
//   _.set(req?.query, 'include[course_resources][include][resources]', 'all');
//   _.set(req?.query, 'include[assigned_rooms]', 'all');
//   _.set(req?.query, 'include[assigned_rooms][include][course_room]', 'all');
//   _.set(req?.query, 'include[lessonSessionApproval]', 'all');
//   _.set(req?.query, 'include[lessonSessionApproval][q][is_optional]', true);
//   _.set(req?.query, 'include[lessonSessionApproval][q][is_full_course]', true);
//   _.set(req?.query, 'include[lessonSessionApproval][q][lesson_session_id][eq]', null);
//   _.set(req?.query, 'include[lessonSessionApproval][include][assignedToUser]select', 'first_name,last_name,id');
//   _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources]', 'all');
//   _.set(
//     req?.query,
//     'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][courseRoom]',
//     'all',
//   );
//   _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][resource]', 'all');
//   _.set(req?.query, 'include[trainer_assigned_room_resources]', 'all');
// }

// export async function handleAllCoursePrivateIndividual(req: Request) {
//   if (!_.isUndefined(req.query.course_slug)) _.set(req?.query, 'q[slug]', req.query.course_slug);
//   if (!_.isUndefined(req.query.course_to_ignore))
//     _.set(req?.query, 'q[slug][notIn]', String(req.query.course_to_ignore).split(','));

//   _.set(req?.query, 'q[is_template]', false);
//   _.set(req?.query, 'q[status]', CourseStatus.publish);
//   _.set(
//     req?.query,
//     'select',
//     'id,title,slug,duration,marked_as,start_date,end_date,has_exam,price,price_in,image,category_id,sub_category_id,language,parent_table_id,validity,maximum_participate_allowed,founded,funded_by',
//   );
//   _.set(req?.query, 'include[card]', 'id,name,slug');
//   _.set(req?.query, 'include[card]include[company]', 'id,name,slug');
//   if (!_.isUndefined(req.query.courseCategory)) {
//     _.set(req?.query, 'q[category_id][in]', String(req.query.courseCategory).split(','));
//   }

//   if (!_.isUndefined(req.query.type)) {
//     _.set(req?.query, 'q[type][in]', String(req.query.type).split(','));
//   }
//   if (!_.isUndefined(req.query.courseSubCategory)) {
//     _.set(req?.query, '[q][sub_category_id][in]', String(req.query.courseSubCategory).split(','));
//   }
//   if (!_.isUndefined(req.query.startDate) && !_.isUndefined(req.query.endDate)) {
//     _.set(req?.query, 'q[start_date][between]', [
//       new Date(String(req.query.startDate)),
//       new Date(String(req.query.endDate)),
//     ]);

//     _.set(req?.query, 'q[end_date][between]', [
//       new Date(String(req.query.startDate)),
//       new Date(String(req.query.endDate)),
//     ]);
//   }

//   // if (!_.isUndefined(req.query.status)) {
//   //   _.set(req?.query, 'q[status][in]', String(req.query.status).split(','));
//   // }
//   if (!_.isUndefined(req.query.marked_as)) {
//     _.set(req?.query, 'q[marked_as][in]', String(req.query.marked_as).split(','));
//   }
//   _.set(req?.query, 'include[courseCategory][select]', 'id,name,slug');
//   _.set(req?.query, 'include[courseSubCategory][select]', 'id,name,slug');

//   _.set(req?.query, 'include[createdByUser][select]', 'first_name,last_name');

//   if (!_.isUndefined(req.query.detailedView)) {
//     _.set(req?.query, 'include[codes][select]', 'code');
//     _.set(req?.query, 'include[lessons][include][lesson_resources][select]', 'id');
//     _.set(req?.query, 'include[course_notes][select]', 'content');
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][select]',
//       'id,start_time,end_time,conference_provider',
//     );
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser][select]',
//       'first_name,last_name',
//     );

//     if (req.query?.course_type) {
//       _.set(req?.query, 'q[type]', req?.query?.course_type);
//     }
//     _.set(req?.query, 'include[enrolled_courses]', 'all');
//     if (req?.query?.private_individual_id) {
//       _.set(req?.query, 'include[enrolled_courses][q][private_individual_id]', req.query?.private_individual_id);
//     }
//   }
// }

// export async function handleAllCourseManagerEnrolledCourses(req: Request) {
//   _.set(req?.query, 'q[is_template]', false);
//   _.set(
//     req?.query,
//     'select',
//     'id,title,slug,duration,validity,marked_as,start_date,end_date,has_exam,price,price_in,image,category_id,sub_category_id,language,parent_table_id,funded_by,status,type',
//   );

//   if (req?.query?.is_publish) {
//     _.set(req?.query, 'q[status][eq]', CourseStatus.publish);
//   }
//   _.set(req?.query, 'include[academy]', 'id,name,slug');
//   _.set(req?.query, 'include[card]', 'id,name,slug');
//   _.set(req?.query, 'include[card]include[company]', 'id,name,slug');

//   _.set(req?.query, 'include[courseCategory]', 'id,name,slug');
//   _.set(req?.query, 'include[courseSubCategory]', 'id,name,slug');
//   _.set(req?.query, 'include[createdByUser]select', 'first_name,last_name');

//   _.set(req?.query, 'include[enrolled_courses]', 'all');
//   _.set(req?.query, 'include[enrolled_courses][q][company_id][in]', req.query?.company_id);
//   if (req.query?.course_type) {
//     _.set(req?.query, 'q[type]', req?.query?.course_type);
//     if (req.query?.course_type !== CourseType.Private) {
//       _.set(req?.query, 'include[enrolled_courses][required]', true);
//     } else {
//       _.set(req?.query, 'include[projects][select]', 'id,card_id');
//       _.set(req?.query, 'include[projects]include[card][select]', 'id');
//       _.set(req?.query, 'include[projects]include[card]include[card_Company][select]', 'id,company_id,card_id');
//       _.set(
//         req?.query,
//         'include[projects]include[card]include[card_Company][q][company_id][eq]',
//         req?.query?.company_id,
//       );
//       _.set(req?.query, 'include[projects][required]', true);
//       _.set(req?.query, 'include[projects]include[card][required]', true);
//       _.set(req?.query, 'include[projects]include[card]include[card_Company][required]', true);
//     }
//   }
// }

// export async function handleAllCourseManagerDashboard(req: Request) {
//   _.set(req?.query, 'q[is_template]', false);
//   _.set(
//     req?.query,
//     'select',
//     'id,title,slug,duration,validity,marked_as,start_date,end_date,has_exam,price,price_in,image,category_id,sub_category_id,language,parent_table_id,funded_by,status',
//   );

//   _.set(req?.query, 'include[enrolled_courses]', 'all');

//   if (req.query?.company_id && req.query?.manager_id) {
//     _.set(req?.query, 'include[enrolled_courses][q][company_id]', req.query?.company_id);
//     _.set(req?.query, 'include[enrolled_courses][q][manager_id]', req.query?.manager_id);
//   }
//   if (req.query?.private_individual_id) {
//     _.set(req?.query, 'include[enrolled_courses][q][private_individual_id]', req.query?.private_individual_id);
//   }

//   _.set(req?.query, 'include[enrolled_courses][required]', true);
// }

// export async function handleCodeFilterReports(req: Request) {
//   _.set(req?.query, 'select', 'id,code');
//   if (req?.query?.category_id) {
//     _.set(req?.query, 'include[courses][select]', 'id,title');
//     _.set(req?.query, 'include[courses][include][courseCategory][select]', 'id,name');
//     _.set(
//       req?.query,
//       'include[courses][include][courseCategory][q][id][in]',
//       (req?.query?.category_id as string).split(','),
//     );
//     _.set(req?.query, 'include[courses][include][courseCategory][required]', true);
//     _.set(req?.query, 'include[courses][required]', true);
//   }
// }

// export async function handleCertificateRemain(req: Request) {
//   _.set(req?.query, 'select', 'id,slug,start_date,end_date,title,image');
//   _.set(req?.query, '[q][end_date][lte]', req?.query?.end_date);
//   _.set(req?.query, 'include[course_participates][select]', 'id,slug,is_certificate_issued');
//   _.set(req?.query, 'include[course_participates][q][is_certificate_issued]', false);
//   _.set(req?.query, 'include[course_participates][include][courseParticipateExam]select', 'id,slug,status,is_submit');
//   _.set(
//     req?.query,
//     'include[course_participates][include][courseParticipateExam][q][status]',
//     ExamParticipateStatusEnum.pass,
//   );
//   _.set(req?.query, 'include[course_participates][include][courseParticipateExam][q][is_submit]', true);
//   _.set(req?.query, 'include[course_participates][include][courseParticipateExam][required]', true);
//   _.set(req?.query, 'include[course_participates][required]', true);
//   _.set(req?.query, 'include[courseCategory]', 'id,name');
// }

// export async function handlePendingProposals(req: Request) {
//   // template :false
//   _.set(req?.query, '[q][template]', false);
//   _.set(req?.query, 'select', 'id,slug,start_date,end_date,title,image');
//   _.set(req?.query, 'include[lessons]select', 'id,slug,title');
//   _.set(req?.query, 'include[lessons]required', true);
//   _.set(req?.query, 'include[lessons][include][lesson_sessions]select', 'id');
//   _.set(req?.query, 'include[lessons][include][lesson_sessions]required', true);
//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
//     'id,assigned_to_status,created_at',
//   );
//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to_status][in]',
//     [AssignedStatus.Requested, AssignedStatus.Draft],
//   );
//   _.set(req?.query, 'include[lessons][include][lesson_sessions][include][lessonSessionApproval][required]', true);
//   _.set(req?.query, 'include[courseCategory]', 'id,name');
// }

// export async function handleTrainerLossDashboard(req: Request) {
//   _.set(req?.query, '[q][assigned_to_status]', AssignedStatus.Accepted);

//   _.set(req?.query, '[q][trainer_assigned_to_status]', AssignedStatus.Accepted);
//   _.set(req?.query, 'include[assignedToUser][select]', 'id,first_name,last_name,username');
//   _.set(req?.query, 'include[assignedToUser][include][trainer]', '');
//   _.set(req?.query, 'include[courses]', 'id,price,marked_as,mode,start_date,is_template,image,title,type');

//   _.set(req?.query, 'include[courses]include[course_participates]', '');
//   _.set(req?.query, 'include[courses][q][language]', req?.language);
//   _.set(req?.query, 'include[courses][required]', true);
//   _.set(req?.query, 'include[courses]include[courseCategory]', '');
// }
// export async function handleCategoriesFilterReports(req: Request) {
//   _.set(req?.query, 'select', 'id,name');
//   if (req?.query?.code_id) {
//     _.set(req?.query, 'include[courses][select]', 'id,code,title,code_id');
//     _.set(req?.query, 'include[courses][include][codes][select]', 'id,code');
//     _.set(req?.query, 'include[courses][include][codes][q][id][in]', (req?.query?.code_id as string).split(','));
//     _.set(req?.query, 'include[courses][include][codes][required]', true);
//     _.set(req?.query, 'include[courses][required]', true);
//   }
// }

// export async function handleAllCourseManagerAttendees(req: Request) {
//   _.set(req?.query, 'include[lesson_sessions][required]', true);
//   _.set(req?.query, 'include[lesson_sessions]include[lesson_session_approval][required]', true);
//   _.set(
//     req?.query,
//     'include[lesson_sessions]include[lesson_session_approval]include[courses][q][id][in]',
//     req.query.courseIds,
//   );
// }

// export async function handleGetPrivateIndividualEnrolledCourse(req: Request) {
//   if (req.query?.course_type) {
//     _.set(req?.query, 'q[type]', req?.query?.course_type);
//   }
//   _.set(req?.query, 'q[is_template]', false);
//   _.set(
//     req?.query,
//     'select',
//     'id,title,slug,duration,marked_as,start_date,end_date,has_exam,price,price_in,image,category_id,sub_category_id,language,parent_table_id,status',
//   );
//   _.set(req?.query, 'include[academy]', 'id,name,slug');

//   _.set(req?.query, 'include[courseCategory]', 'id,name,slug');
//   _.set(req?.query, 'include[courseSubCategory]', 'id,name,slug');
//   _.set(req?.query, 'include[createdByUser]select', 'first_name,last_name');

//   _.set(req?.query, 'include[enrolled_courses]', 'all');
//   _.set(req?.query, 'include[enrolled_courses][q][private_individual_id]', req.query?.private_individual_id);
//   _.set(req?.query, 'include[enrolled_courses][required]', true);
// }

// export async function handleInternalCallCourse(req: Request) {
//   if (req.query.course) {
//   }
//   _.set(req?.query, 'q[is_template]', false);
//   _.set(
//     req?.query,
//     'select',
//     'id,validity,title,slug,description,type,duration,code,marked_as,is_template,start_date,end_date,has_exam,need_digital_attendance_sheet,founded,funded_by,reject_reason,meeting_room_number,maximum_participate_allowed,price,price_in,certificate_pdf_link,maximum_participation_attendance,image,status,course_template_id,category_id,cloned_course_id,sub_category_id,language,parent_table_id,created_by,assigned_to,created_at,updated_at,deleted_at,academy_id,code_id',
//   );
//   _.set(req?.query, 'include[lessons]', 'all');
//   _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
//   _.set(req?.query, 'include[exam]', 'all');
// }

// export async function handleAllCourseTemplate(req: Request) {
//   _.set(req?.query, 'q[is_template]', true);
//   _.set(req?.query, 'include[access]', 'user_id,delete,edit,view');
//   if (req?.query?.status) _.set(req?.query, 'q[status]', req?.query?.status);
//   if (req?.query?.bundle) {
//     _.set(req?.query, 'select', 'id,image,title,slug');
//   } else {
//     _.set(
//       req?.query,
//       'select',
//       'id,validity,title,slug,description,type,duration,code,marked_as,is_template,start_date,end_date,has_exam,need_digital_attendance_sheet,founded,funded_by,reject_reason,meeting_room_number,maximum_participate_allowed,price,price_in,certificate_pdf_link,maximum_participation_attendance,image,status,course_template_id,category_id,cloned_course_id,sub_category_id,language,parent_table_id,created_by,assigned_to,created_at,updated_at,deleted_at,academy_id,code_id,survey_template_id,certificate_title,certificate_template_id,course_bundle_id',
//     );
//     if (req?.query?.courseCode) {
//       _.set(req?.query, 'include[codes]', 'all');
//       _.set(req?.query, 'include[codes][q][slug][in]', (req?.query?.courseCode as string).split(','));
//       _.set(req?.query, 'include[codes][required]', true);
//     }
//     _.set(req?.query, 'include[lessons]', 'all');
//     _.set(req?.query, 'include[lessons]include[topics]', 'all');
//     _.set(req?.query, 'include[course_resources]', 'all');
//     _.set(req?.query, 'include[course_resources]include[resources]', 'title');
//     _.set(req?.query, 'include[createdByUser]select', 'first_name,last_name');
//     _.set(req?.query, 'include[createdByUser][include][role]', 'name');
//     _.set(req?.query, 'include[lessons][include][lesson_resources]', 'all');
//     _.set(req?.query, 'include[courseCategory]', 'all');
//     if (req?.query?.courseCategory) {
//       _.set(req?.query, 'include[courseCategory][q][id][in]', (req?.query?.courseCategory as string).split(','));
//       _.set(req?.query, 'include[courseCategory][required]', true);
//     }
//     _.set(req?.query, 'include[courseSubCategory]', 'all');
//     if (req?.query?.courseSubCategory) {
//       _.set(req?.query, 'include[courseSubCategory][q][id][in]', (req?.query?.courseSubCategory as string).split(','));
//       _.set(req?.query, 'include[courseSubCategory][required]', true);
//     }
//     _.set(req?.query, 'include[course_notes]', 'all');
//     _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
//       'assigned_to_status',
//     );
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser]select',
//       'first_name,last_name',
//     );
//     _.set(req?.query, 'include[exam]', 'all');
//     _.set(req?.query, 'include[exam][include][questions]', 'all');
//     _.set(req?.query, 'include[exam][include][questions][include][answers]', 'all');
//     _.set(req?.query, 'include[access]', 'all');
//   }
// }

// export async function handleAllCourseCategoryForTemplates(req: Request) {
//   _.set(req?.query, 'include[courseSubCategories]', 'all');
//   _.set(req?.query, 'include[courseSubCategories][include][courses][q][is_template]', true);

//   _.set(req?.query, 'include[courseSubCategories][include][courses][q][language]', req.language);
//   _.set(req?.query, 'include[courseSubCategories][include][courses][required]', true);
//   _.set(req?.query, 'include[courses][q][is_template]', true);

//   _.set(req?.query, 'include[courses][q][language]', req.language);
//   _.set(req?.query, 'include[courses][required]', true);
// }

// export async function handleAllCourseTemplateDropdown(req: Request) {
//   _.set(req?.query, 'q[is_template]', true);
//   _.set(
//     req?.query,
//     'select',
//     'id,validity,title,duration,has_exam,need_digital_attendance_sheet,founded,funded_by,maximum_participate_allowed,price,certificate_pdf_link,image,status,category_id,sub_category_id,language,academy_id,code_id,survey_template_id,certificate_title,certificate_template_id',
//   );
//   // _.set(req?.query, 'include[assigned_rooms]', 'all');
//   _.set(req?.query, 'include[courseCategory]', 'all');
//   _.set(req?.query, 'include[course_resources]', 'all');
//   _.set(req?.query, 'include[course_resources]include[resources]', 'title');

//   _.set(req?.query, 'include[lessons][select]', 'title,mode,place_address,conference_provider');
//   _.set(req?.query, 'include[lessons]include[topics]', 'all');
//   _.set(req?.query, 'include[codes][select]', 'code');
//   _.set(req?.query, 'include[lessons][include][lesson_resources][select]', 'id');
//   _.set(req?.query, 'include[course_notes][select]', 'content');
//   _.set(req?.query, 'include[lessons][include][lesson_sessions][select]', 'start_time,end_time,client_meeting_link');
//   _.set(req?.query, 'include[exam]', 'all');
//   _.set(req?.query, 'include[exam][include][questions][select]', 'question,marks');
//   _.set(req?.query, 'include[exam][include][questions][include][answers][select]', 'answer,is_correct');
// }

// export async function handleAcademy(req: Request) {
//   _.set(req?.query, 'label', 'name');
//   if (req?.query.value) _.set(req?.query, 'value', req?.query.value);
// }

// export async function handleTrainerTodaySession(req: Request) {
//   _.set(req.query, '[q][status][eq]', CourseStatus.publish);
//   _.set(req?.query, 'include[lessons]', 'all');
//   _.set(req?.query, 'include[lessonSessionApproval]', 'all');
//   _.set(req?.query, 'include[lessonSessionApproval][q][assigned_to][eq]', req?.query?.trainer_id);
//   _.set(req?.query, 'include[lessonSessionApproval][required]', true);

//   const currentDate = new Date(
//     Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0),
//   );
//   const endOfDay = new Date(
//     Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999),
//   );
//   _.set(req?.query, 'include[lessons][q][date][between]', [currentDate.toISOString(), endOfDay.toISOString()]);

//   _.set(req?.query, 'include[lessons][required]', true);
// }
// export async function handleAssignedTrainingSpeRepo(req: Request) {
//   _.set(req?.query, 'q[active]', USER_STATUS.ACTIVE);
//   const language = req?.language ? req?.language : defaultLanguage;
//   if (req?.query?.start_date && req?.query?.end_date) {
//     const startDate = new Date(req.query.start_date as string);
//     const endDate = new Date(req.query.end_date as string);
//     startDate.setHours(0, 0, 0, 0);
//     endDate.setHours(23, 59, 59, 999);
//     _.set(req?.query, 'q[created_at][between]', [startDate, endDate]);
//   }
//   _.set(req?.query, 'include[role]', 'id,name');
//   _.set(req?.query, 'include[role][q][name][eq]', RoleEnum.TrainingSpecialist);
//   _.set(req?.query, 'include[role]required', true);
//   _.set(req?.query, 'include[creatorUser]', 'all');
//   _.set(req?.query, 'include[card_members]', 'all');
//   _.set(req?.query, 'include[card_members][q][language]', language);
// }

// export async function handleProjectsByStages(req: Request) {
//   const { tokenData } = req;

//   const user = parse(tokenData.user);
//   _.set(req?.query, 'include[cards]', 'all');
//   _.set(req?.query, 'include[cards]include[card_company]', 'all');
//   _.set(req?.query, 'include[cards][include][project]', 'all');
//   _.set(req?.query, 'sort', 'cards.card_order');

//   if (user.role_name !== RoleEnum.Admin) {
//     _.set(req?.query, 'include[cards][include][card_members]', 'all');
//     _.set(req?.query, 'include[cards][include][card_members][q][user_id]', user.id);
//     _.set(req?.query, 'include[cards][include][card_members][required]', true);
//   }

//   /* Project Relations */
//   // Project Quotes

//   _.set(req?.query, 'include[cards][include][project][include][project_quotes]', 'all');
//   _.set(req?.query, 'include[cards][include][project][include][project_quotes][include][quote]', 'all');
//   _.set(
//     req?.query,
//     'include[cards][include][project][include][project_quotes][include][quote][q][status]',
//     QuoteStatusEnum.approved,
//   );
//   _.set(req?.query, 'include[cards][include][project][include][project_quotes][include][quote][required]', true);

//   if (req.query?.members) {
//     const members = (req.query?.members as string).split(',');
//     _.set(req?.query, 'include[cards][include][card_members]', 'all');
//     _.set(req?.query, 'include[cards][include][card_members][q][user_id][in]', members);
//     _.set(req?.query, 'include[cards][include][card_members][required]', true);
//   }
//   if (!_.isUndefined(req?.query?.priority)) {
//     const priority = (req.query?.priority as string).split(',');
//     _.set(req?.query, 'include[cards][q][priority][in]', priority);
//     _.set(req?.query, 'include[cards][required]', true);
//   }
//   if (!_.isUndefined(req?.query?.start_date) && !_.isUndefined(req?.query?.end_date)) {
//     const startDate = new Date(req.query.start_date as string);
//     const endDate = new Date(req.query.end_date as string);

//     startDate.setHours(0, 0, 0, 0);
//     endDate.setHours(23, 59, 59, 999);

//     _.set(req?.query, 'include[cards][include][project][q][add_time][between]', [startDate, endDate]);
//     _.set(req?.query, 'include[cards][include][project][q][close_time][between]', [startDate, endDate]);

//     _.set(req?.query, 'include[cards][include][project][required]', true);
//   }
// }

// export async function handleCourseByStages(req: Request) {
//   const { tokenData } = req;

//   const user = parse(tokenData.user);

//   //ignore query builder search builder
//   _.set(req?.query, 'ignoreSearchField', true);

//   _.set(req?.query, 'include[cards]', 'all');

//   _.set(req?.query, 'include[cards][include][courses]', 'all');
//   _.set(req?.query, 'include[cards][include][courses][include][projects]', 'id,title');

//   if (req.query?.project_id) {
//     _.set(req?.query, 'include[cards][include][courses][q][project_id]', req.query?.project_id);
//   }
//   if (req.query?.search) {
//     _.set(req?.query, 'include[cards][include][courses][q][title][like]', `%${req.query.search}%`);
//     _.set(req?.query, 'include[cards][include][courses][required]', true);
//   }

//   if (req.query?.training_specialist_id) {
//     _.set(req?.query, 'include[cards][include][courses][include][lessonSessionApproval][select]', 'id');
//     _.set(
//       req?.query,
//       'include[cards][include][courses][include][lessonSessionApproval][q][assigned_to]',
//       req.query?.training_specialist_id,
//     );
//     _.set(req?.query, 'include[cards][include][courses][required]', true);
//     _.set(req?.query, 'include[cards][include][courses][include][lessonSessionApproval][required]', true);
//   }

//   if (req.query?.members) {
//     const members = (req.query?.members as string).split(',');
//     _.set(req?.query, 'include[cards][include][card_members]', 'all');
//     _.set(req?.query, 'include[cards][include][card_members][q][user_id][in]', members);
//     _.set(req?.query, 'include[cards][include][card_members][required]', true);
//   }

//   if (user.role_name !== RoleEnum.Admin) {
//     _.set(req?.query, 'include[cards][include][card_members]', 'all');
//     _.set(req?.query, 'include[cards][include][card_members][q][user_id]', user.id);
//     _.set(req?.query, 'include[cards][include][card_members][required]', true);
//   }

//   /*  Card Relations  */
//   // Card Activity Join
//   _.set(req?.query, 'include[cards][include][card_activities][select]', 'id');

//   // Card Attachment Join
//   _.set(req?.query, 'include[cards][include][card_attachments][select]', 'id');

//   // Card Label Join
//   _.set(req?.query, 'include[cards][include][card_labels][select]', 'id,label_id,card_id');
//   _.set(req?.query, 'include[cards][include][card_labels][include][label][select]', 'id,title,color');

//   if (req.query?.labels !== undefined) {
//     const labels = (req.query?.labels as string).split(',');

//     if (req.query?.labels && labels.length) {
//       _.set(req?.query, 'include[cards][include][card_labels][q][label_id][in]', labels);
//       _.set(req?.query, 'include[cards][include][card_labels][required]', true);
//     }
//   }
// }

// export async function handleProjectManagementStages(req: Request) {
//   _.set(req?.query, 'select', 'id,order,name');
// }
// export async function handleAllEmails(req: Request) {
//   _.set(req?.query, 'select', 'id,module_name,slug,emails');
// }

// export async function handleCourseManagementStages(req: Request) {
//   _.set(req?.query, 'select', 'id,order,name');

//   _.set(req?.query, 'sort', 'id');
//   if (req.query.logs) {
//     _.set(req?.query, 'sort', '-card_stage_logs.id');
//     _.set(req?.query, 'limit', '-card_stage_logs.id');
//     _.set(req?.query, 'include[card_stage_logs]', 'all');
//     if (req.query.card_id) {
//       _.set(req?.query, 'include[card_stage_logs][q][card_id]', req.query.card_id);
//       _.set(req?.query, 'include[card_stage_logs][limit]', 1);
//     }
//   }
// }

// export async function handleAllProject(req: Request) {
//   _.set(req?.query, 'include[project_notes]', 'all');
// }

// export async function handleGetCardActivities(req: Request) {
//   _.set(req?.query, 'select', 'id,description,created_at,updated_at');
//   _.set(req?.query, 'sort', '-id');
//   _.set(req?.query, 'include[createdByUser][select]', 'id,first_name,last_name,email,contact,profile_image,username');
// }

// export async function handleGetCardMembers(req: Request) {
//   _.set(req?.query, 'select', 'id,user_id,card_id,created_by');
//   _.set(req?.query, 'include[member][select]', 'id,first_name,last_name,email,contact,profile_image,username');
// }

// export async function handleGetCardLabels(req: Request) {
//   _.set(req?.query, 'select', 'id,label_id,card_id,created_by');
//   _.set(req?.query, 'include[label][select]', 'id,title,color,created_by');
// }

// export async function handleGetCardAttachments(req: Request) {
//   _.set(req?.query, 'select', 'id,attachment_url,card_id,created_by');
// }

// export async function handleGetProjects(req: Request) {
//   // Project Notes
//   _.set(req?.query, 'include[project_notes]', 'all');

//   // Project Quotes
//   _.set(req?.query, 'include[project_quotes]', 'all');
//   _.set(req?.query, 'include[project_quotes][include][quote]', 'all');

//   // Project Course
//   _.set(req?.query, 'include[courses]', 'all');
//   _.set(req?.query, 'include[courses][include][lessonSessionApproval]', 'all');
//   _.set(req?.query, 'include[courses][include][course_participates][select]', 'id');
//   _.set(
//     req?.query,
//     'include[courses][include][lessonSessionApproval][include][assignedToUser][select]',
//     'id,full_name,first_name,last_name,email,username',
//   );
//   _.set(
//     req?.query,
//     'include[courses][include][lessonSessionApproval][include][assignedToUser][include][trainer]',
//     'all',
//   );
//   _.set(req?.query, 'include[courses][include][lessons]', 'all');
//   _.set(req?.query, 'include[courses][include][lessons][include][lesson_sessions]', 'all');
// }

// export async function handleProjectsCardDetailsV2(req: Request) {
//   _.set(req?.query, 'include[stage][select]', 'id,name,order');
//   _.set(req?.query, 'include[manager]', 'all');
//   _.set(req?.query, 'include[company]', 'all');
//   _.set(req?.query, 'include[card_company]', 'all');
//   _.set(req?.query, 'include[card_company]include[company]', 'all');
// }

// export async function handleProjectsCardDetails(req: Request) {
//   _.set(req?.query, 'include[card][select]', 'id,title,slug');
//   _.set(req?.query, 'include[card][include][stage][select]', 'id,name,order');
//   _.set(req?.query, 'include[card]include[card_company]', 'all');
//   /* Project Relations */
//   // Project Notes
//   _.set(req?.query, 'include[project_notes]', 'all');

//   // Project Course
//   _.set(req?.query, 'include[courses]', 'all');

//   // Project Quotes
//   _.set(req?.query, 'include[quotes]', 'all');

//   /*  Card Relations  */
//   // Card Activity Join
//   _.set(req?.query, 'include[card][include][card_activities][select]', 'id,description');
//   _.set(
//     req,
//     'include[card][include][card_activities][include][createdByUser][select]',
//     'id,first_name,last_name,email,contact,profile_image,username',
//   );

//   // Card Member Join
//   _.set(req?.query, 'include[card][include][card_members][select]', 'id,user_id,card_id');
//   _.set(
//     req,
//     'include[card][include][card_members][include][member][select]',
//     'id,first_name,last_name,email,contact,profile_image,username',
//   );

//   // Card Label Join
//   _.set(req?.query, 'include[card][include][card_labels][select]', 'id,label_id,card_id');
//   _.set(req?.query, 'include[card][include][card_labels][include][label][select]', 'id,title,color');

//   // Card Attachment Join
//   _.set(req?.query, 'include[card][include][card_attachments][select]', 'id,attachment_url,card_id');
// }

// export async function handleCourseCardDetailsV2(req: Request) {
//   _.set(req?.query, 'include[stage][select]', 'id,name,order');
//   _.set(req?.query, 'include[manager]', 'all');
//   _.set(req?.query, 'include[company]', 'all');
// }

// export async function handleCourseCardDetails(req: Request) {
//   _.set(req?.query, 'include[card][select]', 'id,title,slug');
//   _.set(req?.query, 'include[card][include][stage][select]', 'id,name,order');
//   _.set(req?.query, 'include[card][include][card_activities][select]', 'id,description');

//   // Card Activity Join
//   _.set(req?.query, 'include[card][include][card_activities][select]', 'id,description');
//   _.set(
//     req,
//     'include[card][include][card_activities][include][createdByUser][select]',
//     'id,first_name,last_name,email,contact,profile_image,username',
//   );

//   // Card Member Join
//   _.set(req?.query, 'include[card][include][card_members][select]', 'id,user_id,card_id');
//   _.set(
//     req,
//     'include[card][include][card_members][include][member][select]',
//     'id,first_name,last_name,email,contact,profile_image,username',
//   );

//   // Card Label Join
//   _.set(req?.query, 'include[card][include][card_labels][select]', 'id,label_id,card_id');
//   _.set(req?.query, 'include[card][include][card_labels][include][label][select]', 'id,title,color');

//   // Card Attachment Join
//   _.set(req?.query, 'include[card][include][card_attachments][select]', 'id,attachment_url,card_id');
// }

// export async function handleAllLessonApprovals(req: Request) {
//   _.set(req?.query, 'q[assigned_to]', req?.query.userId);
//   _.set(req?.query, 'select', 'id,assigned_to_status');
//   _.set(
//     req?.query,
//     'include[assignedToUser][select]',
//     'id,full_name,first_name,last_name,email,contact,username,profile_image',
//   );
//   _.set(req?.query, 'include[lessonSessions]', 'all');
//   _.set(req?.query, 'include[lessonSessions][include][lesson]', 'all');
//   _.set(
//     req?.query,
//     'include[lessonSessions][include][lesson][include][course]',
//     'id,start_date,end_date,title,assigned_to,slug,type',
//   );
// }

// export async function handleAllLabels(_req: Request) {
//   // Handle All Labels case here
// }

// export async function handleAllQuotes(req: Request) {
//   if (req?.query?.quoteId) _.set(req.query, 'q[id]', req.query.quoteId);
//   if (req?.query?.search) {
//     _.set(
//       req?.query,
//       'include[company][select]',
//       'id,name,logo,address1,address2,city,state,country,zip,vat_number,ateco_code,sdi_code',
//     );
//   }

//   _.set(
//     req?.query,
//     'include[company][select]',
//     'id,name,logo,address1,address2,city,state,country,zip,vat_number,ateco_code,sdi_code',
//   );

//   _.set(req.query, 'include[quoteProduct]', 'all');
//   _.set(req.query, 'include[quoteProduct][q][main_id][eq]', null);
//   _.set(req.query, 'include[quoteProduct][include][codes]', 'all');
//   _.set(req.query, 'include[project]', 'id,title');
// }

// export async function handleAllCodeQuotes(req: Request) {
//   if (req?.query?.codeId) _.set(req.query, 'q[code_id]', req.query.codeId);
//   _.set(req.query, 'include[quotes]', 'quote_number,status');
//   _.set(req.query, 'include[quotes][required]', true);
//   if (req?.query?.status) _.set(req.query, 'include[quotes][q][status]', req?.query?.status);
// }

// export async function handleAllQuoteProductLogs(req: Request) {
//   if (req?.query?.productId) _.set(req.query, 'q[logs_product_id]', req.query.productId);
//   _.set(req.query, 'include[quote_product_logs]', 'all');
// }

// export async function handleAllProducts(req: Request) {
//   if (req?.query?.type) _.set(req.query, 'q[invoice_status][eq]', 'Invoiced');
//   if (req?.query?.status) {
//     _.set(req.query, 'q[invoice_status][in]', (req?.query?.status as string).split(','));
//   }
//   _.set(req.query, 'q[invoice_status][ne]', InvoiceStatus.NotCompleted);
//   _.set(req.query, 'q[order_close][ne]', true);
//   _.set(req.query, 'include[codes]', 'course_code_type');
//   if (req?.query?.productType) {
//     _.set(req.query, 'include[codes][q][course_code_type][in]', (req?.query?.productType as string).split(','));
//   }
//   _.set(req.query, 'include[quotes]', 'all');
//   _.set(req.query, 'include[quotes]include[order]q[language]', req.language);
//   _.set(req.query, 'q[main_id][ne]', null);
// }

// export async function handleCodeDetails(req: Request) {
//   if (req?.query?.code) {
//     _.set(req?.query, '[q][code][eq]', req.body.code);
//     _.set(req?.query, 'include[codeProduct][q][code_id][eq]', req?.query?.code);
//   }
// }

// export async function handleCodes(req: Request) {
//   if (req?.query?.code) _.set(req?.query, 'q[code]', req?.query?.code);

//   if (req?.query?.quote_id) {
//     _.set(req?.query, 'include[codeProduct]select', 'id');
//     _.set(req?.query, 'include[codeProduct][q][quote_id]', req?.query?.quote_id);
//   }
//   _.set(req?.query, 'select', 'id,code,description,language,parent_table_id,slug,course_code_type,created_by');
//   _.set(req?.query, 'include[courses]select', 'id,image,code_id,price');
//   _.set(req?.query, 'include[courses][q][is_template]', true);
//   _.set(req?.query, 'include[courses][q][language]', req.language);
//   _.set(req?.query, 'include[courses]include[courseSubCategory]', 'id,name,slug');
//   if (req?.query?.type) {
//     const type = (req.query?.type as string).split(',');
//     _.set(req?.query, '[q][course_code_type][in]', type);
//   }
//   if (req?.query?.course_code) {
//     _.set(req?.query, '[q][course_code_type][eq]', CodeTypeEnum.course);
//   }
// }

// export async function handleLogs(req: Request) {
//   _.set(
//     req?.query,
//     'select',
//     'id,title,description,slug,created_by,created_at,feature_id,is_language_considered,language,module_id,permission_type',
//   );

//   if (req?.query?.modulesId) {
//     _.set(req?.query, '[q][feature_id][in]', (req?.query?.modulesId as string).split(','));
//   }
//   _.set(req?.query, 'include[feature]', 'name');

//   if (!_.isUndefined(req.query.startDate) && !_.isUndefined(req.query.endDate)) {
//     _.set(req?.query, 'q[created_at][between]', [
//       new Date(String(req.query.startDate)),
//       new Date(String(req.query.endDate)),
//     ]);

//     // _.set(req?.query, 'q[created_at][between]', [new Date(String(req.query.startDate)), new Date(String(req.query.endDate))]);
//   }
// }

// export async function handleAllManagerDetails(req: Request) {
//   _.set(
//     req?.query,
//     'include[company][select]',
//     'id,name,uuid,user_id,legal_name,registration_number,slug,website,industry,description,size,logo',
//   );

//   _.set(
//     req?.query,
//     'include[manager][select]',
//     'id,user_id,job_title,billing_address1,billing_address2,billing_city,billing_country,billing_state,billing_zip',
//   );

//   _.set(
//     req?.query,
//     'include[manager][include][user][select]',
//     'id,email,full_name,first_name,last_name,username,contact,profile_image,address1,address2,city,state,country,zip',
//   );
//   // if (req.query?.search) {
//   //   _.set(req?.query, 'include[company][q][name][like]', `%${req.query.search}%`);
//   //   // _.set(req?.query, 'include[company][required]', true);

//   //   _.set(req?.query, 'include[manager][include][user][q][first_name]', `%${req.query.search}%`);
//   //   // _.set(req?.query, 'include[manager][include][user][required]', true);
//   // }
// }

// export async function handleManagerDetails(req: Request) {
//   _.set(
//     req?.query,
//     'include[user][select]',
//     'id,email,full_name,first_name,last_name,username,contact,profile_image,address1,address2,city,state,country,zip',
//   );

//   // #RESOLVED : https://trello.com/c/Rjs7wNhr/104-company-manager-page-shows-company-info-twice-in-personal-info-tab
//   _.set(req?.query, 'include[company_manager][q][language]', req?.language);
//   _.set(req?.query, 'include[company_manager][select]', 'id,company_id,manager_id');
//   _.set(req?.query, 'include[company_manager][include][company][required]', true);
//   _.set(
//     req?.query,
//     'include[company_manager][include][company][select]',
//     'id,name,uuid,user_id,name,legal_name,registration_number,slug,website,industry,description,size,logo,vat_number,is_invoice,accounting_emails,ateco_code,sdi_code,address1,address2,city,state,country,zip',
//   );
// }

// export async function handleGetAllCoursesOfTrainers(req: Request) {
//   _.set(req?.query, 'select', 'id,assigned_to_status');
//   // _.set(req?.query, 'q[assigned_to]', req?.tokenData?.user?.id);
//   _.set(req?.query, 'include[lessonSessions][required]', true);
//   _.set(req?.query, 'include[lessonSessions][select]', 'id');
//   _.set(req?.query, 'include[lessonSessions][include][course][required]', true);
//   // _.set(req?.query, 'include[lessonSessions][include][course][select]', '');
//   _.set(req?.query, 'include[lessonSessions][include][course][q][is_template]', false);
//   _.set(req?.query, 'include[lessonSessions][include][course][q][language]', req.language);
//   _.set(req?.query, 'include[lessonSessions][include][course][include][courseSubCategory]', 'name');
//   _.set(req?.query, 'include[lessonSessions][include][course][include][createdByUser]', 'first_name,last_name');

//   _.set(req?.query, 'include[createdByUser][include][role]', 'name');
// }

// export async function handleGetAllCoursesOfTrainer(req: Request) {
//   const userId = req?.query.user_id ? req?.query.user_id : req?.tokenData?.user?.id;
//   const courseParams = 'id,slug,image,title,start_date,has_exam,end_date,type,status,certificate_pdf_link';
//   _.set(req?.query, 'include[card][select]', 'id');
//   _.set(req?.query, 'include[trainerRequest][select]', 'id,note');
//   _.set(
//     req?.query,
//     'include[card][include][card_attachments][select]',
//     'attachment_url,attachment_type,is_funded_documents,show_trainer',
//   );

//   // main trainer ? extra trainer
//   if (!_.isUndefined(req.query.type)) {
//     _.set(req?.query, 'q[type][in]', String(req.query.type).split(','));
//   }

//   if (!_.isUndefined(req.query.course_type)) {
//     _.set(req?.query, 'q[type][in]', String(req.query.course_type).split(','));
//   }

//   if (!_.isUndefined(req.query.status)) {
//     _.set(req?.query, 'q[status][in]', String(req.query.status).split(','));
//   }
//   if (req?.query?.course_slug) _.set(req?.query, 'q[slug]', req?.query?.course_slug);
//   _.set(req?.query, 'q[is_template]', false);
//   _.set(req?.query, 'select', courseParams);
//   _.set(req?.query, 'include[createdByUser][select]', 'first_name,last_name');
//   _.set(req?.query, 'include[courseCategory][select]', 'id,name,slug');

//   if (req?.query?.companies) {
//     _.set(req?.query, 'include[projects][required]', true);
//     _.set(req?.query, 'include[projects][include][quotes]', 'all');
//     _.set(req?.query, 'include[projects][include][quotes][include][company]', 'all');
//     _.set(
//       req?.query,
//       'include[projects][include][quotes][include][company][q][id][in]',
//       (req?.query?.companies as string).split(','),
//     );
//   }
//   if (req?.query?.trainingSpecialist) {
//     _.set(req?.query, 'include[createdByUser][q][id][in]', (req?.query?.trainingSpecialist as string).split(','));
//     _.set(req?.query, 'include[createdByUser][required]', true);
//   }
//   _.set(req?.query, 'include[courseSubCategory][select]', 'id,name,slug');

//   // if (req?.query?.course_slug) {
//   _.set(
//     req?.query,
//     'select',
//     'id,validity,title,slug,description,type,duration,code,marked_as,start_date,end_date,has_exam,need_digital_attendance_sheet,founded,funded_by,reject_reason,meeting_room_number,maximum_participate_allowed,price,price_in,certificate_pdf_link,maximum_participation_attendance,image,status,course_template_id,category_id,cloned_course_id,sub_category_id,language,parent_table_id,created_by,assigned_to,created_at,updated_at,deleted_at,academy_id,code_id',
//   );
//   _.set(req?.query, 'include[codes][select]', 'code');
//   _.set(req?.query, 'include[lessons][select]', 'id,title,mode,date,slug,conference_provider');
//   _.set(req?.query, 'include[lessons]required', true);
//   _.set(req?.query, 'include[course_notes][select]', 'content');
//   _.set(req?.query, 'include[lessons][include][lesson_sessions][select]', 'id,start_time,end_time');
//   _.set(req?.query, 'include[lessons][include][lesson_sessions]required', true);

//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][select]',
//     'assigned_to_status',
//   );
//   if (_.isUndefined(req?.query?.is_invite) && req?.tokenData?.user.role_name !== RoleEnum.Admin) {
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to_status]',
//       AssignedStatus.Accepted,
//     );
//   }

//   if (![RoleEnum.Admin, RoleEnum.CompanyManager].includes(parse(req?.tokenData?.user).role_name)) {
//     //removed training specialist role from above condition as while viewing trainer's course in ts it was showing all the courses
//     _.set(
//       req?.query,
//       'include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to]',
//       userId,
//     );
//   }

//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser][select]',
//     'first_name,last_name,profile_image',
//   );

//   _.set(req?.query, 'include[lessons][include][lesson_sessions][include][lessonSessionApproval][required]', true);
//   if (!_.isUndefined(req.query.courseCategory)) {
//     _.set(req?.query, 'include[courseCategory][q][slug][in]', String(req.query.courseCategory).split(','));
//     _.set(req?.query, 'include[courseCategory][required]', true);
//   }
// }
// export async function handleAttendanceSheet(req: Request) {
//   _.set(req?.query, '[q][language]', req.language);
//   if (req?.query?.company_id) {
//     _.set(req?.query, '[q][company_id]', req?.query?.company_id);
//   }
//   _.set(req?.query, '[include][course][q][slug]', req.query.course_slug);
//   _.set(req?.query, '[include][company]', 'all');
//   _.set(req?.query, '[include][course][select]', []);
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][select]',
//     'id,mark_as_start_signed_at,mark_as_end_signed_at,end_signature,start_signature,mark_as_end_signed,mark_as_start_signed,mark_as_absent,set_early_arrival,set_early_arrival',
//   );
//   _.set(req?.query, '[include][courseAttendanceLog]', 'all');

//   _.set(req?.query, '[include][courseAttendanceSheet][required]', true);
//   if (_.isUndefined(req?.query?.lesson_session_id)) {
//     _.set(req?.query, '[include][courseAttendanceSheet][q][course_id]', req.query.course_id);
//     _.set(req?.query, '[include][courseAttendanceSheet][include][course][select]', 'start_date,end_date');
//     _.set(req?.query, '[include][courseAttendanceSheet][q][lesson_session_id]', '');
//     _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][select]', 'start_time,end_time');
//   } else if (!_.isUndefined(req?.query?.lesson_session_id)) {
//     _.set(req?.query, '[include][courseAttendanceSheet][q][course_id]', req.query.course_id);
//     _.set(req?.query, '[include][courseAttendanceSheet][q][lesson_session_id]', req?.query?.lesson_session_id);
//     _.set(req?.query, '[include][courseAttendanceSheet][include][course][select]', 'start_date,end_date');
//     _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][select]', 'start_time,end_time');
//   }
// }

// export async function handleAttendanceSheetOfParticipate(req: Request) {
//   if (req?.query?.course_participate_id) _.set(req.query, 'q[id]', req?.query?.course_participate_id);

//   _.set(req?.query, '[q][language]', req.language);
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][select]',
//     'id,mark_as_start_signed_at,mark_as_end_signed_at,end_signature,start_signature,mark_as_end_signed,mark_as_start_signed,mark_as_absent,set_early_arrival,set_early_leave',
//   );

//   _.set(req?.query, '[include][recoverCourse][select]', 'slug,title');
//   _.set(req?.query, '[include][recoveredFromParticipate][select]', 'first_name,last_name,id');
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][include][lessonSession][select]',
//     'id,start_time,end_time,slug,language,course_id',
//   );
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][q][language]', req?.language);
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][include][lesson]', 'id,title,date');
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][include][courseAttendanceLog]', 'all');
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][include][lessonSession][include][course][select]',
//     'id,start_date,end_date',
//   );
//   _.set(req?.query, '[include][courseAttendanceSheet][q][lesson_session_id][ne]', '');
// }

// export async function handleGetCourseDetails(req: Request) {
//   _.set(req?.query, 'include[createdByUser]', 'all');
//   _.set(req?.query, 'include[lessons]', 'all');
//   _.set(req?.query, 'include[lesson_sessions]', 'all');
//   _.set(req?.query, 'include[card][select]', 'id,title,stage_id');
//   _.set(req?.query, 'include[assignedTo]', 'all');
//   _.set(req?.query, 'include[courseCategory][select]', 'id,name');
//   _.set(req?.query, 'include[courseSubCategory][select]', 'id,name');

//   _.set(req?.query, 'include[lessons][include][lesson_sessions]', 'all');
//   _.set(req?.query, 'include[lesson_sessions]', 'all');

//   _.set(req?.query, 'include[lessons][include][conference_provider]', 'all');
//   _.set(req?.query, 'include[lessons][include][calendar_provider]', 'all');

//   _.set(req?.query, 'include[lessons][include][lesson_sessions][include][conference_provider]', 'all');
//   _.set(req?.query, 'include[lessonSessionApproval]', 'all');
//   _.set(req?.query, 'include[assigned_rooms]', 'all');
//   _.set(req?.query, 'include[course_resources]', 'all');
//   _.set(req?.query, 'include[course_resources][include][trainerAssignedRoomResources]', 'all');

//   if (req?.query?.checkLessonSessionApproval) {
//     _.set(req?.query, 'include[lessonSessionApproval][q][assigned_to_status]', AssignedStatus.Accepted);
//     _.set(req?.query, 'include[lessonSessionApproval][q][trainer_assigned_to_status]', AssignedStatus.Accepted);
//     _.set(req?.query, 'include[lessonSessionApproval][include][assignedToUser]', 'all');
//   }

//   if (req?.query?.checkLessonSessionApprovalOptionalTrainer) {
//     _.set(req?.query, 'include[lessonSessionApproval][q][assigned_to_status]', AssignedStatus.Accepted);
//     _.set(req?.query, 'include[lessonSessionApproval][q][trainer_assigned_to_status]', AssignedStatus.Accepted);
//     _.set(req?.query, 'include[lessonSessionApproval][q][lesson_session_id][eq]', null);
//     _.set(req?.query, 'include[lessonSessionApproval][q][is_optional]', true);
//     _.set(req?.query, 'include[lessonSessionApproval][q][assigned_to]', req.query?.trainer_id);
//   }

//   if (req?.query?.checkLessonSessionApprovalTrainer) {
//     _.set(req?.query, 'include[lessonSessionApproval][q][trainer_assigned_to_status]', AssignedStatus.Accepted);
//     _.set(req?.query, 'include[lessonSessionApproval][q][assigned_to]', req.query?.trainer_id);
//   }

//   _.set(req?.query, 'include[course_participates][select]', 'id');
//   if (typeof req?.query?.checkCourseParticipatesCertiIssue === 'boolean') {
//     _.set(
//       req?.query,
//       'include[course_participates][q][is_certificate_issued]',
//       req?.query?.checkCourseParticipatesCertiIssue,
//     );
//   }
//   // _.set(req?.query, 'include[lessons][include][lesson_sessions][include][calendar_provider]', 'all');
// }

// export async function handleTrackCourse(req: Request) {
//   //ignore query builder search builder
//   _.set(req?.query, 'include[cards]', 'all');
//   _.set(req?.query, 'include[cards][card_stage_logs]', 'all');
//   _.set(req?.query, 'include[cards][include][courses]', 'all');
//   _.set(req?.query, 'include[cards][include][courses][q][slug]', req.params.slug);
//   _.set(req?.query, 'include[cards][include][courses][required]', true);
// }

// export async function handleGetCourseQROfExamDetails(req: Request) {
//   _.set(req?.query, '[q]slug', req.query.course_slug);
//   _.set(req?.query, '[select]', 'slug');
//   _.set(req?.query, 'include[exam][select]', 'qr_string,slug,url');
// }

// export async function handleGetRating(req: Request) {
//   _.set(req.query, '[q][language]', req?.language);
//   if (parse(req?.tokenData?.user)?.role_name === RoleEnum.Trainer) {
//     _.set(req.query, '[include][courseTrainer][q][id]', req?.tokenData?.user?.id);
//   }
//   if (req?.query?.trainer_id) {
//     _.set(req.query, 'q[course_trainer_id]', req?.query?.trainer_id);
//   }
//   _.set(req.query, '[include][courseTrainer]', 'all');
//   _.set(req.query, '[include][survey_question][q][question_type][in]', [
//     SurveyQuestionEnum.rate,
//     SurveyQuestionEnum.scale,
//   ]);
//   _.set(req.query, '[include][survey_question][required]', true);
//   _.set(req.query, '[include][courseSurvey]', 'all');
// }

// export async function handleGetCourseQROfSurveyDetails(req: Request) {
//   _.set(req?.query, '[q]slug', req.query.course_slug);
//   _.set(req?.query, 'select', 'survey_qr,slug,survey_url');
//   _.set(req.query, 'sort', '-id');
// }

// export async function handleGetCourseOfSurveyResult(req: Request) {
//   _.set(req?.query, '[q][language]', req?.language);
//   _.set(req?.query, 'include[survey_question]', 'all');
//   _.set(req?.query, 'include[survey_question]include[surveyAnswer]', 'all');
//   _.set(req?.query, 'include[answerSurvey]', 'all');
//   _.set(req?.query, 'include[courseSurvey]', 'all');

//   if (parse(req?.tokenData?.user)?.role_name === RoleEnum.Trainer) {
//     _.set(req?.query, '[q][course_trainer_id][ne]', null);
//   }
//   if (req?.query?.course_slug) {
//     _.set(req?.query, 'include[courseSurvey][q][slug]', req?.query?.course_slug);
//     _.set(req?.query, 'include[courseSurvey][required]', true);
//   }
// }

// export async function handleGetAllCourseParticipates(req: Request) {
//   if (req?.query?.get_unknown) _.set(req.query, 'q[is_unknown]', true);
//   _.set(req.query, 'include[company]', 'all');
//   _.set(req.query, 'include[course]', 'all');
//   _.set(req.query, 'include[course]include[courseCategory]', 'all');
//   _.set(req.query, 'include[courseParticipateExam]', 'all');
//   _.set(req.query, 'include[recoveredFromParticipate]', 'all');
//   _.set(req.query, 'include[recoverCourse]', 'slug,title');
//   if (req.query.company_id) _.set(req?.query, '[q]company_id', req.query.company_id);
//   if (req.query.companies) _.set(req?.query, '[q][company_id][in]', req.query.companies);
//   if (req.query.participate_slug) _.set(req?.query, '[q]slug', req.query.participate_slug);

//   if (req.query.course_slug) {
//     _.set(req.query, 'include[course][q]slug', req?.query?.course_slug);
//     _.set(req.query, 'include[course]required', true);
//   }
//   if (req.query.courseCategory) {
//     _.set(req.query, 'include[course]include[courseCategory][q]slug', req?.query?.courseCategory);
//     _.set(req.query, 'include[course]include[courseCategory][required]', true);
//     _.set(req.query, 'include[course]required', true);
//   }
//   if (req?.query?.codes) {
//     _.set(req.query, 'include[course][q][code][in]', String(req.query.codes).split(','));
//     _.set(req.query, 'include[course]required', true);
//   }

//   if (req.query.slug) _.set(req?.query, '[q]slug', req.query.slug);

//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][select]',
//     'id,mark_as_start_signed_at,mark_as_end_signed_at,end_signature,start_signature,mark_as_end_signed,mark_as_start_signed,mark_as_absent,set_early_arrival,set_early_leave',
//   );
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][include][lessonSession][select]',
//     'id,start_time,end_time,slug,language,course_id',
//   );
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][q][language]', req?.language);
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][include][lesson]', 'id,title,date');
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][include][courseAttendanceLog]', 'all');
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][include][lessonSession][include][course][select]',
//     'id,start_date,end_date',
//   );
//   _.set(req?.query, '[include][courseAttendanceSheet][q][lesson_session_id][ne]', null);
//   _.set(req?.query, '[include][is_recovered][select]', 'id,course_id');
// }

// export async function handleGetAllCourseBundleParticipates(req: Request) {
//   if (req.query.company_id) _.set(req?.query, '[q]company_id', req.query.company_id);
//   if (req.query.participate_slug) _.set(req?.query, '[q]slug', req.query.participate_slug);
//   if (req.query.course_slug) {
//     _.set(req.query, 'include[course][q]slug', req?.query?.course_slug);
//   }
//   _.set(req.query, 'include[company]', 'name,id,slug');
//   _.set(req.query, 'include[course]select', 'title,slug');
//   if (req.query.course_bundle_id) {
//     _.set(req?.query, 'include[course][q]course_bundle_id', req.query.course_bundle_id);
//     _.set(req.query, 'include[course][required]', true);
//   }
//   if (req.query.slug) _.set(req?.query, '[q]slug', req.query.slug);
// }

// export async function handleGetAllCourseBundleParticipateCompanies(req: Request) {
//   //company
//   _.set(req.query, 'select', 'logo,name,id,slug');
//   _.set(req.query, 'include[enrolled_company]select', []);
//   _.set(req?.query, 'include[enrolled_company]include[course][q][course_bundle_id]', req.query.course_bundle_id);
//   _.set(req?.query, 'include[enrolled_company]include[course]select', []);
//   _.set(req.query, 'include[enrolled_company]include[course][required]', true);
//   _.set(req.query, 'include[enrolled_company][required]', true);
//   _.set(
//     req.query,
//     'include[courseParticipateExam]',
//     'id,first_name,last_name,exam_slug,course_id,exam_id,course_participate_id,selected_language,slug,status',
//   );
//   if (req.query.slug) _.set(req?.query, '[q]slug', req.query.slug);

//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][select]',
//     'id,mark_as_start_signed_at,mark_as_end_signed_at,end_signature,start_signature,mark_as_end_signed,mark_as_start_signed,mark_as_absent,set_early_arrival,set_early_leave',
//   );
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][include][lessonSession][select]',
//     'id,start_time,end_time,slug,language,course_id',
//   );
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][q][language]', req?.language);
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][include][lesson]', 'id,title,date');
//   _.set(req?.query, '[include][courseAttendanceSheet][include][lessonSession][include][courseAttendanceLog]', 'all');
//   _.set(
//     req?.query,
//     '[include][courseAttendanceSheet][include][lessonSession][include][course][select]',
//     'id,start_date,end_date',
//   );
//   _.set(req?.query, '[include][courseAttendanceSheet][q][lesson_session_id][ne]', null);
// }

// export async function handleAttendanceSheetOfCourseParticipates(req: Request) {
//   if (req.query.company_id) _.set(req?.query, '[q]company_id', req.query.company_id);
//   if (req.query.participate_slug) _.set(req?.query, '[q]slug', req.query.participate_slug);
//   if (req.query.course_slug) {
//     _.set(req.query, 'include[course][q]slug', req?.query?.course_slug);
//   }

//   _.set(req.query, 'include[company]', 'all');
//   _.set(req.query, 'include[course]', 'all');
//   if (req.query.slug) _.set(req?.query, '[q]slug', req.query.slug);
// }

// export async function handleGetCompanyDropdown(req: Request) {
//   _.set(req.query, 'select', 'id,name,legal_name,slug');
// }

export async function handleGetFeatureDropdown(req: Request) {
  _.set(req.query, 'select', 'id,name');
}

// export async function handleGetManagerDropdown(req: Request) {
//   _.set(req.query, 'select', 'id,first_name,last_name,full_name');
//   _.set(req?.query, 'q[active]', USER_STATUS.ACTIVE);
//   if (req.query?.company_id) {
//     _.set(req.query, 'include[manager]', 'all');
//     _.set(req.query, 'include[manager][required]', true);
//     _.set(req.query, 'include[manager][include][company_manager]', 'all');
//     _.set(req.query, 'include[manager][include][company_manager][q][company_id]', req.query.company_id);
//     _.set(req.query, 'include[manager][include][company_manager][required]', true);
//   }
// }

// export async function handleTrainerCourseInvitation(req: Request) {
//   const courseParams = 'id,slug,image,title,start_date,end_date,type,status,certificate_pdf_link,course_bundle_id';
//   if (req?.query?.course_slug) _.set(req?.query, 'q[slug]', req?.query?.course_slug);

//   _.set(req?.query, 'q[is_template]', false);
//   _.set(
//     req?.query,
//     '[include][lessonSessionApproval]select',
//     'assigned_to_status,is_full_course,course_id,course_id,lesson_session_id,is_optional,assigned_to,course_bundle_id,request_id,trainer_assigned_to_status',
//   );
//   _.set(req?.query, '[include][lessonSessionApproval]include[lessons]', 'all');
//   _.set(req?.query, '[include][lessonSessionApproval]include[trainerRequest][select]', 'id,note');
//   _.set(
//     req?.query,
//     '[include][lessonSessionApproval]select',
//     'id,assigned_to_status,is_full_course,course_id,course_id,lesson_session_id,is_optional,assigned_to,course_bundle_id',
//   );
//   // _.set(req?.query, '[include][lessonSessionApproval][q][lesson_session_id]', '');
//   _.set(req?.query, '[include][lessonSessionApproval][q][trainer_assigned_to_status]', AssignedStatus.Requested);
//   _.set(req?.query, '[include][lessonSessionApproval][q][assigned_to]', req?.tokenData?.user?.id);
//   _.set(req?.query, 'include[lessonSessionApproval][include][assignedToUser]select', 'first_name,last_name,id');
//   _.set(
//     req.query,
//     'include[lessonSessionApproval]include[assignedToUser][include][trainer]select',
//     'hourly_rate,travel_reimbursement_fee,location,longitude,latitude,reimbursement_threshold',
//   );
//   _.set(req?.query, 'include[lessonSessionApproval][include][lessonSessions]select', 'slug,start_time,end_time');
//   _.set(
//     req?.query,
//     'include[lessonSessionApproval][include][lessons]select',
//     'id,title,mode,address_map_link,client_meeting_link,date,location,longitude,latitude',
//   );
//   _.set(req?.query, 'select', courseParams);
//   _.set(req?.query, 'include[createdByUser][select]', 'first_name,last_name');
//   _.set(req?.query, 'include[courseCategory][select]', 'id,name,slug');
//   _.set(req?.query, 'include[courseSubCategory][select]', 'id,name,slug');

//   _.set(
//     req?.query,
//     'select',
//     'id,validity,title,slug,description,type,duration,code,marked_as,start_date,end_date,has_exam,need_digital_attendance_sheet,founded,funded_by,reject_reason,meeting_room_number,maximum_participate_allowed,price,price_in,certificate_pdf_link,maximum_participation_attendance,image,status,course_template_id,category_id,cloned_course_id,sub_category_id,language,parent_table_id,created_by,assigned_to,created_at,updated_at,deleted_at,academy_id,code_id,course_bundle_id',
//   );
//   _.set(req?.query, 'include[codes][select]', 'code');
//   _.set(req?.query, 'include[lessons][select]', 'id,title,mode,date,slug,conference_provider');
//   _.set(req?.query, 'include[course_notes][select]', 'content');
//   _.set(req?.query, 'include[lessons][include][lesson_sessions][select]', 'id,start_time,end_time,slug');
//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval]select',
//     'assigned_to_status,is_full_course,course_id,course_id,lesson_session_id,is_optional,course_bundle_id',
//   );
//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][trainer_assigned_to_status]',
//     AssignedStatus.Requested,
//   );
//   _.set(req?.query, 'include[lessons][include][lesson_sessions][include][lessonSessionApproval][required]', true);

//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][q][assigned_to]',
//     req?.tokenData?.user?.id,
//   );
//   _.set(
//     req?.query,
//     'include[lessons][include][lesson_sessions][include][lessonSessionApproval][include][assignedToUser]select',
//     'first_name,last_name,id',
//   );
// }
// export async function handleTrainerCourseBundleInvitation(req: Request) {
//   if (req?.query?.course_bundle_id) _.set(req.query, 'q[course_bundle_id]', req?.query?.course_bundle_id);
//   _.set(req?.query, 'q[assigned_to]', req?.tokenData?.user?.id);
//   _.set(req?.query, 'q[course_id]', '');
//   _.set(req?.query, 'q[trainer_assigned_to_status]', AssignedStatus.Requested);
//   _.set(req?.query, 'q[is_full_course]', false);
//   _.set(req?.query, 'include[lessons]', 'all');
//   _.set(req?.query, 'include[lessonSessions]', 'all');
//   _.set(req?.query, 'include[course_bundle]required', true);
//   _.set(req.query, 'include[assignedToUser]select', 'first_name,last_name');
//   _.set(req.query, 'include[course_bundle]select', 'slug,id,start_date,end_date,title');
//   _.set(req.query, 'include[courses]select', 'slug,id,start_date,end_date,title,language');
//   _.set(req?.query, 'include[lessonSessions]select', 'id,start_time,end_time,slug,language');
//   _.set(req?.query, 'include[lessonSessions][q][language]', req?.language);
//   _.set(req?.query, 'include[lessonSessions]include[lesson]select', 'id,title,mode,date,slug,conference_provider');
//   _.set(req?.query, 'include[courses][q][language]', req?.language);
// }

// export async function handleTrainerCourseBundlesInvitation(req: Request) {
//   if (req?.query?.course_bundle_id) {
//     _.set(req.query, 'q[course_bundle_id]', req?.query?.course_bundle_id);
//   } else {
//     _.set(req?.query, 'q[course_id]', '');
//     _.set(req?.query, 'q[is_full_course]', false);
//   }
//   _.set(req?.query, 'q[assigned_to]', req?.tokenData?.user?.id);
//   _.set(req?.query, 'q[trainer_assigned_to_status]', AssignedStatus.Requested);
//   _.set(req?.query, 'include[lessons]', 'all');
//   _.set(req?.query, 'include[lessonSessions]', 'all');
//   _.set(req?.query, 'include[course_bundle]required', true);
//   _.set(req.query, 'include[assignedToUser]select', 'first_name,last_name');
//   _.set(req.query, 'include[assignedToUser]include[trainer]', 'all');
//   _.set(req.query, 'include[course_bundle]select', 'slug,id,start_date,end_date,title');
//   _.set(req.query, 'include[courses]select', 'slug,id,start_date,end_date,title,language');
//   _.set(req?.query, 'include[lessonSessions]select', 'id,start_time,end_time,slug,language');
//   _.set(req?.query, 'include[lessonSessions][q][language]', req?.language);
//   _.set(req?.query, 'include[lessonSessions]include[lesson]select', 'id,title,mode,date,slug,conference_provider');
//   _.set(req?.query, 'include[courses][q][language]', req?.language);
// }

// export async function handleCourseBundle(req: Request) {
//   if (req?.query?.bundle_slug) _.set(req?.query, 'q[slug]', req?.query?.bundle_slug);
//   if (req?.query?.status) _.set(req?.query, 'q[status]', req?.query?.status);
//   _.set(req?.query, 'select', 'id,title,slug,description,created_by,updated_by');
//   _.set(
//     req?.query,
//     'include[course_bundle]select',
//     'id,course_template_id,slug,course_bundle_id,created_by,updated_by,language',
//   );
//   _.set(req?.query, 'include[course_bundle][q][language]', req?.language);
//   _.set(req?.query, 'include[course_bundle]required', true);
//   _.set(
//     req?.query,
//     'include[course_bundle]include[courseTemplate]select',
//     'id,image,slug,code,title,category_id,sub_category_id',
//   );
//   _.set(req?.query, 'include[course_bundle]include[courseTemplate]include[courseCategory]select', 'id,name');
//   _.set(req?.query, 'include[course_bundle]include[courseTemplate]include[courseSubCategory]select', 'id,name');
//   _.set(req?.query, 'include[access]', 'all');
// }
// export async function handleGetCompanyWiseQuotes(req: Request) {
//   if (req.query?.company_id) {
//     _.set(req.query, 'q[id]', req.query?.company_id);
//   }
//   _.set(req?.query, 'include[Quotes]', 'all');
//   if (req.query?.quote_type) {
//     _.set(req?.query, 'include[Quotes][q][quote_type]', QuoteTypeEnum.Private);
//   }
//   if (req.query?.search) {
//     _.set(req?.query, 'include[Quotes][q][quote_number][like]', `%${req.query.search}%`);
//     _.set(req?.query, 'include[Quotes][required]', true);
//   }
//   _.set(req?.query, 'include[Quotes][required]', true);
//   _.set(req?.query, 'include[Quotes][include][projectQuotes]', 'all');
// }

// export async function handleAllCompanyOfCourse(req: Request) {
//   _.set(req?.query, 'select', 'id,course_slug,private_individual_id');
//   _.set(req?.query, '[q][language]', req?.language);
//   _.set(req?.query, 'include[company]', 'all');
//   _.set(req?.query, 'include[private_individual]', 'id,username,first_name,last_name,profile_image');
//   _.set(req?.query, 'include[course]select', 'title,slug,start_date,end_date,image');
//   if (req?.query?.course_slug) _.set(req?.query, 'include[course][q][slug]', String(req?.query?.course_slug));
//   if (req?.query?.course_slug) _.set(req?.query, 'include[course][required]', true);
//   _.set(
//     req?.query,
//     'include[course][include][lessonSessionApproval]select',
//     'assigned_to_status,is_full_course,course_id,course_id,lesson_session_id,is_optional',
//   );
//   _.set(req?.query, 'include[course][include][lessonSessionApproval][q][assigned_to_status]', AssignedStatus.Accepted);

//   _.set(
//     req?.query,
//     'include[course]include[lessonSessionApproval][include][assignedToUser]select',
//     'first_name,last_name,id',
//   );

//   _.set(req?.query, 'include[course]include[courseSubCategory]', 'id,name,slug');
//   _.set(req?.query, 'include[course]include[courseCategory]', 'id,name,slug');
//   _.set(req?.query, 'include[manager]', 'all');
// }

// export async function handleAllEnrolledCompany(req: Request) {
//   if (req?.query.companyIds) _.set(req?.query, 'q[id][in]', req?.query.companyIds);
// }

// export async function handleAttendeesResult(req: Request) {
//   if (req?.query.courseIds) _.set(req?.query, 'q[course_id][in]', req?.query.courseIds);
//   _.set(req?.query, 'include[course]select', 'id,title,image,description,start_date,end_date');

//   _.set(req?.query, 'include[course]include[courseSubCategory]', 'id,name,slug');
//   _.set(req?.query, 'include[course]include[courseCategory]', 'id,name,slug');
//   _.set(
//     req?.query,
//     'include[course]include[lessons][include][lesson_sessions][select]',
//     'start_time,end_time,client_meeting_link,slug,assigned_to',
//   );
//   _.set(req?.query, 'include[course][include][lessonSessionApproval][q][assigned_to_status]', AssignedStatus.Accepted);

//   _.set(
//     req?.query,
//     'include[course]include[lessonSessionApproval][include][assignedToUser]select',
//     'first_name,last_name,id',
//   );
//   _.set(req?.query, 'include[exam_participate]', 'id,slug');
//   _.set(req?.query, 'include[course_participate]', 'id,company_id');
//   if (req?.query?.companyIds) {
//     _.set(req?.query, 'include[course_participate][q][company_id][in]', req?.query?.companyIds);
//     _.set(req?.query, 'include[course_participate][required]', true);
//   }
//   _.set(req?.query, 'include[course_participate]include[company]', 'id,name,logo,address1,address2,city,country,state');
// }

// export async function handleExamDetails(req: Request) {
//   // _.set(req?.query, 'select', 'all');
//   if (req?.query?.exam_slug) _.set(req?.query, 'q[slug]', req?.query?.exam_slug);
//   _.set(req?.query, '[include][questions]select', 'id,slug,question,marks');
//   _.set(req?.query, 'include[questions][include][answers]select', 'id,answer,slug');
// }
// export async function handleAllCourseUsedBundleData(req: Request) {
//   if (req?.query?.bundle_slug) _.set(req?.query, 'q[slug]', req?.query?.bundle_slug);
//   if (req?.query?.status) _.set(req?.query, 'q[status]', req?.query?.status);
//   _.set(req?.query, 'select', 'id,title,slug,description,created_by,updated_by,start_date,end_date,academy_id');
//   _.set(req?.query, 'include[academy]', 'all');
//   _.set(req?.query, 'include[courses]required', true);
//   _.set(req?.query, 'include[courses]include][course_participates]select', 'id');
//   _.set(req?.query, 'include[courses]include][course_participates]q[language]', req?.language);
//   _.set(req?.query, 'include[courses][q]language', req.language);
//   _.set(
//     req?.query,
//     'include[courses]include[lessons][select]',
//     'slug,title,mode,place_address,conference_provider,date,location',
//   );
//   _.set(req?.query, 'include[access]', 'all');
//   // _.set(req?.query, 'include[access]required', true);
//   _.set(
//     req?.query,
//     'include[courses]include[lessons][include][lesson_sessions][select]',
//     'start_time,end_time,client_meeting_link,slug,assigned_to',
//   );
//   if (req?.query?.editView) {
//     _.set(req?.query, 'include[course_resources]', 'all');
//     _.set(req?.query, 'include[course_resources]include[resources]', 'title');
//     _.set(req?.query, 'include[assigned_rooms]', 'all');
//     _.set(req?.query, 'include[lesson_session_approval]', 'all');
//     _.set(req?.query, 'include[lesson_session_approval][q][course_id]', '');
//     _.set(
//       req.query,
//       'include[lesson_session_approval]include[assignedToUser]',
//       'first_name,last_name,profile_image,id',
//     );
//     _.set(
//       req?.query,
//       'include[courses]select',
//       'id,course_template_id,slug,course_bundle_id,created_by,updated_by,language,image,title',
//     );
//   }
//   if (_.isUndefined(req?.query?.tableView) || !req?.query?.tableView) {
//     _.set(
//       req?.query,
//       'include[courses][include][lessonSessionApproval]select',
//       'assigned_to_status,is_full_course,course_id,course_id,lesson_session_id,is_optional',
//     );
//     _.set(req?.query, 'include[courses][include][lessonSessionApproval]q[is_full_course]', true);
//     _.set(req?.query, 'include[courses][include][lessonSessionApproval]q[lesson_session_id]', '');
//     _.set(
//       req?.query,
//       'include[courses]include[lessonSessionApproval][include][assignedToUser]select',
//       'first_name,last_name,id,profile_image',
//     );
//     _.set(req?.query, 'include[courses]include[lessonSessionApproval][include][trainerAssignedRoomResources]', 'all');
//     _.set(
//       req?.query,
//       'include[courses]include[lessonSessionApproval][include][trainerAssignedRoomResources][include][courseRoom]',
//       'all',
//     );
//     _.set(
//       req?.query,
//       'include[courses]include[lessonSessionApproval][include][trainerAssignedRoomResources][include][resource]',
//       'all',
//     );
//   }
// }

// export async function handleGetCourseTrainerDetails(req: Request) {
//   _.set(req.query, 'q[course_id]', req.query.course_id);
//   _.set(req.query, 'include[courses]select', 'start_date,end_date,slug');
//   _.set(req.query, 'include[assignedToUser]select', 'first_name,last_name,profile_image,id');
//   _.set(
//     req.query,
//     'include[assignedToUser][include][trainer]select',
//     'hourly_rate,travel_reimbursement_fee,location,longitude,latitude,reimbursement_threshold',
//   );
//   _.set(req.query, 'include[lessonSessions]', 'all');
//   _.set(req.query, 'include[lessonSessions][include][lesson][select]', 'id,mode,title,location,longitude,latitude');
// }

// export async function handleExamResult(req: Request) {
//   _.set(req.query, 'q[exam_id]', req.query.exam_id);
//   _.set(req.query, 'include[exam_question]', []);
//   _.set(req.query, 'include[exam_question]include[answers]', []);
//   _.set(req.query, 'include[exam_answer]', []);
//   _.set(req.query, '', req.query.exam_id);
//   _.set(req.query, 'q[exam_participate_id][in]', req.query.exam_participate_id);
//   _.set(req.query, 'include[exam_participate]', []);
//   // _.set(req.query, 'include[exam_participate]include[course_participate]', []);
// }

// export async function handleMismatchRecord(req: Request) {
//   if (req?.query.slugArray) _.set(req?.query, 'q[slug][notIn]', req?.query.slugArray);
//   _.set(req?.query, 'include[course]', 'id,slug');
//   if (req?.query?.course_slug) {
//     _.set(req?.query, 'include[course][q][slug][eq]', req?.query?.course_slug);
//     _.set(req?.query, 'include[course][required]', true);
//   }
// }

// export async function handleGetUserDropDownData(req: Request) {
//   // Handle getAllRoleWiseData case
//   const user_id = req?.tokenData.user.id;
//   _.set(req?.query, 'q[active]', USER_STATUS.ACTIVE);

//   if (req?.query.role) {
//     _.set(req?.query, 'q[and][0][role_id][in]', (req?.query.role as string).split(','));
//     _.set(req?.query, 'q[and][1][role_id][ne]', RoleEnum.Admin);
//   }

//   _.set(req.query, 'select', 'id,email,full_name,first_name,last_name,username,contact,profile_image,role_id');
//   _.set(req.query, '[q][id][ne]', user_id);
//   _.set(req?.query, 'include[role][select]', 'id,name');
// }

// export async function handleGetCompanyCourseRequest(req: Request) {
//   _.set(req.query, 'q[company_id]', req.query.company_id);
//   _.set(req.query, 'q[parent_req_id][eq]', null);
//   _.set(req.query, 'include[requested_courses]', 'all');

//   const status = (req.query.status as string)?.split(',');
//   if (status?.length) {
//     _.set(req.query, 'q[status][in]', status);
//   }
// }

// export async function handleGetCourseRequests(req: Request) {
//   _.set(req.query, 'q[parent_req_id][eq]', null);
//   _.set(req.query, 'include[requested_courses]', 'all');
//   _.set(req.query, 'include[company][select]', 'id,name');
//   _.set(req.query, 'include[company][select]', 'id,name');

//   const status = (req.query.status as string)?.split(',');
//   if (status?.length) {
//     _.set(req.query, 'q[status][in]', status);
//   }
// }

// export async function handleGetCourseRequestCourseList(req: Request) {
//   const slug = req.params.slug;

//   _.set(req.query, 'q[slug]', slug);
//   _.set(req.query, 'q[parent_req_id][ne]', null);
//   _.set(req.query, 'include[course]', 'all');
//   _.set(req?.query, 'include[course][include][courseCategory]', 'id,name');
//   _.set(req?.query, 'include[course][include][courseSubCategory]', 'id,name');

//   const status = (req.query.status as string)?.split(',');
//   if (status?.length) {
//     _.set(req.query, 'q[status][in]', status);
//   }
// }

// export async function handleSurveyForm(req: Request) {
//   _.set(req.query, 'q[language]', req?.language);
//   if (req?.query?.sub_category_id) {
//     _.set(req.query, 'include[courseSubcategorySurvey]select', 'id,slug');

//     _.set(req.query, 'include[courseSubcategorySurvey][q][id]', req?.query?.sub_category_id);
//   }
//   if (req?.query?.sub_category_slug) {
//     _.set(req.query, 'include[courseSubcategorySurvey]select', 'id,slug');
//     _.set(req.query, 'include[courseSubcategorySurvey]required', true);
//     _.set(req.query, 'include[courseSubcategorySurvey][q][slug][eq]', req?.query?.sub_category_slug);
//   } else {
//     _.set(
//       req.query,
//       'include[surveyTemplateQuestion]',
//       'id,slug,question,survey_template_id,survey_target,question_type,label,range',
//     );
//     _.set(
//       req.query,
//       'include[surveyTemplateQuestion]include[surveyAnswer]',
//       'id,slug,answer,language,survey_question_id',
//     );
//     _.set(
//       req.query,
//       'include[surveyTemplateQuestion]include[surveyQuestionResult]',
//       'id,survey_template_id,survey_question_id,rate,language,course_trainer_id,slug,answer,answer_id',
//     );
//   }
//   if (req?.query?.course_slug) {
//     _.set(req.query, 'include[courseSurvey][q][slug][eq]', req?.query?.course_slug);
//   }
//   _.set(req.query, 'include[access]', 'all');
//   // _.set(req.query, 'include[access][required]', true);
// }

// export async function handleGetAllCourseRoomBundle(req: Request) {
//   _.set(req.query, 'select', 'id,is_optional,assigned_to');
//   _.set(req.query, 'include[course_room]', 'id,title,slug,maximum_participate');
//   _.set(req.query, 'include[course_bundle]select', 'slug,start_date,end_date');
//   _.set(req.query, 'include[course_bundle]required', true);
//   _.set(req.query, 'include[course_bundle][q][slug]', req?.query?.bundle_slug);
// }

// export async function handleGetAllCourseResourceBundle(req: Request) {
//   _.set(req.query, 'select', 'id,is_optional,assigned_to,quantity');
//   _.set(req.query, 'include[resources]', 'id,title,slug');
//   _.set(req.query, 'include[course_bundle]select', 'slug,start_date,end_date');
//   _.set(req.query, 'include[course_bundle]required', true);
//   _.set(req.query, 'include[course_bundle][q][slug]', req?.query?.bundle_slug);
// }

// export async function handleGetRoomAndResourcesAssignedToTrainers(req: Request) {
//   _.set(req?.query, 'include[course_resources]', 'all');
//   _.set(req?.query, 'include[course_resources][include][resources]', 'all');
//   _.set(req?.query, 'include[assigned_rooms]', 'all');
//   _.set(req?.query, 'include[assigned_rooms][include][course_room]', 'all');
//   _.set(req?.query, 'include[lessonSessionApproval]', 'all');
//   _.set(req?.query, 'include[lessonSessionApproval][q][is_optional]', true);
//   _.set(req?.query, 'include[lessonSessionApproval][q][is_full_course]', true);
//   _.set(req?.query, 'include[lessonSessionApproval][q][lesson_session_id][eq]', null);
//   _.set(req?.query, 'include[lessonSessionApproval][include][assignedToUser]select', 'first_name,last_name,id');
//   _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources]', 'all');
//   _.set(
//     req?.query,
//     'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][courseRoom]',
//     'all',
//   );
//   _.set(req?.query, 'include[lessonSessionApproval][include][trainerAssignedRoomResources][include][resource]', 'all');
//   _.set(req?.query, 'include[trainer_assigned_room_resources]', 'all');
// }

// export async function handleCourseBundleGetRoomAndResourcesAssignedToTrainers(req: Request) {
//   _.set(req?.query, 'include[course_resources]', 'all');
//   _.set(req?.query, 'include[course_resources][include][resources]', 'all');
//   _.set(req?.query, 'include[assigned_rooms]', 'all');
//   _.set(req?.query, 'include[assigned_rooms][include][course_room]', 'all');
//   _.set(req?.query, 'include[lesson_session_approval]', 'all');
//   _.set(req?.query, 'include[lesson_session_approval][q][is_optional]', true);
//   _.set(req?.query, 'include[lesson_session_approval][q][course_id][eq]', null);
//   _.set(req?.query, 'include[lesson_session_approval][q][lesson_session_id][eq]', null);
//   _.set(req?.query, 'include[lesson_session_approval][include][assignedToUser]select', 'first_name,last_name,id');
//   _.set(req?.query, 'include[lesson_session_approval][include][trainerAssignedRoomResources]', 'all');
//   _.set(
//     req?.query,
//     'include[lesson_session_approval][include][trainerAssignedRoomResources][include][courseRoom]',
//     'all',
//   );
//   _.set(
//     req?.query,
//     'include[lesson_session_approval][include][trainerAssignedRoomResources][include][resource]',
//     'all',
//   );
//   _.set(req?.query, 'include[trainer_assigned_room_resources]', 'all');
// }

// export async function handleTrainerDropdown(req: Request) {
//   _.set(req.query, 'select', 'id,first_name,last_name,full_name');
//   _.set(req.query, 'include[trainer]', 'all');
//   _.set(req.query, 'include[trainer][required]', true);
// }

// export async function handleGetCourseBundleTrainerDetails(req: Request) {
//   _.set(req.query, 'q[course_bundle_id]', req.query.course_bundle_id);
//   _.set(req.query, 'include[courses]', 'start_date,end_date,slug');
//   _.set(req.query, 'include[courses][q][language]', req?.language);
//   // _.set(req.query, 'include[courses][required]', true);
//   _.set(req.query, 'include[course_bundle][select]', 'id,title,start_date,end_date,slug');
//   _.set(req.query, 'include[assignedToUser]', 'first_name,last_name,profile_image,id');
//   _.set(req.query, 'include[assignedToUser][include][trainer]', 'all');
//   _.set(req.query, 'include[lessonSessions]', 'all');
//   _.set(req.query, 'include[lessonSessions][include][lesson][select]', 'id,mode');
// }

// export function handleGetCourseBundleDetails(req: Request) {
//   _.set(req.query, 'include[lesson_session_approval]', 'all');
//   _.set(req.query, 'include[course_resources]', 'all');
//   _.set(req.query, 'include[assigned_rooms]', 'all');
//   _.set(req.query, 'include[courses]', 'all');
// }

// export function handleGetAvailableResources(req: Request) {
//   if (req?.query?.dates) {
//     _.set(req?.query, 'include[course_resources]', 'all');
//     // #REMAINING : language model
//     _.set(req?.query, 'include[course_resources]include[courses]', 'all');
//     _.set(req?.query, 'include[course_resources]include[courses][q][language]', LanguageEnum.italian);
//     _.set(req?.query, 'include[course_resources]include[courses]include[lessons]', 'all');
//   }
// }

// export function handleGetAvailableRooms(req: Request) {
//   if (req?.query?.dates) {
//     _.set(req?.query, 'include[assigned_rooms]', 'all');
//     _.set(req?.query, 'include[assigned_rooms]include[courses]', 'all');

//     // #REMAINING : language model
//     _.set(req?.query, 'include[assigned_rooms]include[courses][q][language]', LanguageEnum.italian);

//     if (req?.query?.courseIds)
//       _.set(req?.query, 'include[assigned_rooms]include[courses][q][id][notIn]', req?.query?.courseIds);
//     _.set(req?.query, 'include[assigned_rooms]include[courses]include[lessons]', 'all');
//   }
// }

// export function handleGetCourseParticipantDetails(req: Request) {
//   _.set(req.query, 'include[company]', 'all');
//   _.set(req.query, 'include[course]', 'all');
//   _.set(req.query, 'include[course][include][lessons]', 'all');
//   _.set(req.query, 'include[course][include][lessons][include][lesson_sessions]', 'all');
//   _.set(
//     req.query,
//     'include[course][include][lessons][include][lesson_sessions][include][courseAttendanceSheet]',
//     'all',
//   );
//   _.set(req.query, 'include[course][include][lessons][include][lesson_sessions][include][courseAttendanceLog]', 'all');
// }

// export function handleAllOptionalTrainers(req: Request) {
//   _.set(req.query, 'q[course_bundle_id]', req.query.course_bundle_id);
//   _.set(req.query, 'q[is_optional]', true);
//   _.set(req.query, 'q[assigned_to_status]', AssignedStatus.Accepted);
//   _.set(req.query, 'q[trainer_assigned_to_status]', AssignedStatus.Accepted);
//   _.set(req.query, 'q[course_id]', '');
//   _.set(req.query, 'select', 'assigned_to');
//   _.set(req.query, 'include[trainerAssignedRoomResources]select', 'id');
//   _.set(req.query, 'include[trainerAssignedRoomResources][include][courseRoom]select', 'maximum_participate');
//   _.set(req.query, 'include[trainerAssignedRoomResources][include][courseRoom]required', true);
//   _.set(req.query, '[include][assignedToUser]select', 'id,username,first_name,last_name');
//   _.set(req.query, '[include][assignedToUser]include[trainer]select', 'capacity');
// }

// export function handleCoursesOfBundle(req: Request) {
//   _.set(req.query, 'q[course_bundle_id]', req.query.course_bundle_id);
//   _.set(req.query, 'select', 'id,slug,title');
//   // _.set(req.query, 'q[marked_as][ne]', CourseMarkAsEnum.SoldOut);
//   _.set(req.query, 'include[course_participates]', 'id');
// }

// export function handleGetCourseDropdown(req: Request) {
//   if (req.query.code) {
//     _.set(req.query, 'q[code]', req.query.code);
//   }
//   // if (req.query.latest) {
//   _.set(req.query, 'q[start_date][gt]', new Date());
//   // }
//   _.set(req.query, 'q[status]', CourseStatus.publish);
//   _.set(req.query, 'q[marked_as][notIn]', [CourseMarkAsEnum.SoldOut, CourseMarkAsEnum.TemporarySoldOut]);
//   _.set(req.query, 'select', 'id,title');
// }

// export function handleAllCertificateTemplate(req: Request) {
//   // _.set(req?.query, 'q[language]', req?.language);
//   if (req?.query?.certificate_template_id) {
//     _.set(req?.query, 'q[or][0][certificate_template_id]', req?.query?.certificate_template_id);

//     _.set(req?.query, 'q[or][2][parent_table_id]', req?.query?.certificate_template_id);
//     _.set(req?.query, 'q[or][1][id]', req?.query?.certificate_template_id);
//   }

//   if (req?.query?.certificate_template_ids) {
//     _.set(req?.query, 'q[or][0][certificate_template_id][in]', req?.query?.certificate_template_ids);

//     _.set(req?.query, 'q[or][2][parent_table_id][in]', req?.query?.certificate_template_ids);
//     _.set(req?.query, 'q[or][1][id][in]', req?.query?.certificate_template_ids);
//   }

//   if (req?.query?.id) {
//     _.set(req?.query, 'q[id]', req?.query?.id);
//   }
//   if (req?.query?.slug) {
//     _.set(req?.query, 'q[slug]', req?.query?.slug);
//   }
//   if (req?.query?.is_default) {
//     _.set(req?.query, 'q[is_default]', req?.query?.is_default);
//   }
//   if (req?.query?.is_legislation_included) {
//     _.set(req?.query, 'q[is_legislation_included]', req?.query?.is_legislation_included);
//   }
// }

// export function handleLatest(_req: Request) {
//   // _.set(req?.query, 'q[language]', req?.language);
//   // if (req?.query?.id) {
//   //   _.set(req?.query, 'q[id]', req?.query?.id);
//   // }
//   // if (req?.query?.slug) {
//   //   _.set(req?.query, 'q[slug]', req?.query?.slug);
//   // }
//   // if (req?.query?.is_default) {
//   //   _.set(req?.query, 'q[is_default]', req?.query?.is_default);
//   // }
// }
// export function handleAllFilteredTrainers(req: Request) {
//   _.set(req?.query, 'include[role]', 'all');
//   _.set(req?.query, 'select', 'id,profile_image,first_name,last_name');
//   _.set(req?.query, 'include[role]required', true);
//   _.set(req?.query, 'include[role][q][name]', RoleEnum.Trainer);
//   _.set(req.query, 'q[active]', USER_STATUS.ACTIVE);
//   _.set(req?.query, 'include[trainer]include[trainerSurvey]', 'rate');

//   if (req?.query?.categorySlug) {
//     _.set(
//       req?.query,
//       'include[trainer][include][trainerSubCategory][include][sub_category][q][slug]',
//       req?.query?.categorySlug,
//     );
//   }
//   if (req?.query?.dates) {
//     _.set(
//       req?.query,
//       'include[assignedLessonSession][include][lessons][q][date][in]',
//       (req?.query?.dates as String).split(','),
//     );
//     _.set(req?.query, 'include[assignedLessonSession][include][course][deleted_at]', null);
//     _.set(req?.query, 'include[assignedLessonSession][include][course]required', true);
//     _.set(req?.query, 'include[assignedLessonSession][q][assigned_to_status][in]', [
//       AssignedStatus.Accepted,
//       AssignedStatus.Requested,
//     ]);
//     // _.set(req?.query, 'include[assignedLessonSession][include][lessons]required', true);
//     // _.set(req?.query, 'include[assignedLessonSession]required', true);
//   }
// }

// export function handleSelectedTrainer(req: Request) {
//   _.set(req?.query, 'q[active]', USER_STATUS.ACTIVE);
//   _.set(req?.query, 'include[trainer]include[trainerSurvey]select', 'rate');
//   _.set(req?.query, 'include[assignedLessonSession][q][course_id][in]', req?.query?.courseIds);

//   _.set(req?.query, 'include[assignedLessonSession]required', true);
//   if (req?.query?.categorySlug) {
//     _.set(
//       req?.query,
//       'include[trainer][include][trainerSubCategory][include][sub_category][q][slug]',
//       req?.query?.categorySlug,
//     );
//   }
// }

// export function handleAllTrainers(req: Request) {
//   _.set(req?.query, 'include[role]', 'all');
//   _.set(req?.query, 'include[role]required', true);
//   _.set(req?.query, 'include[role][q][name]', RoleEnum.Trainer);

//   if (req?.query?.dates) {
//     _.set(
//       req?.query,
//       'include[assignedLessonSession][include][lessons][q][date][in]',
//       (req?.query?.dates as String).split(','),
//     );
//     _.set(req?.query, 'include[assignedLessonSession][include][course][deleted_at]', null);
//     _.set(req?.query, 'include[assignedLessonSession][include][course]required', true);
//     _.set(req?.query, 'include[assignedLessonSession][q][assigned_to_status][in]', [
//       AssignedStatus.Accepted,
//       AssignedStatus.Requested,
//     ]);
//     _.set(req?.query, 'include[assignedLessonSession][include][lessons]required', true);
//   }
// }
// export function handleGetAllCourseQuotes(req: Request) {
//   _.set(req?.query, 'select', 'quote_id');
//   _.set(req.query, 'include[quote]select', 'id,quote_number,date,status,destination_email,slug');
// }
// export function handleGetAllCoursePrivateCompanies(req: Request) {
//   _.set(req?.query, 'select', 'company_id');
//   _.set(req.query, 'include[company]select', 'id,name,registration_number,slug');
// }
