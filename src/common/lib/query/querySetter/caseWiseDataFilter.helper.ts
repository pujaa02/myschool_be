// import { RoleEnum, queryBuildCases } from '@/common/constants/enum.constants';
// import { CodeTypeEnum } from '@/common/interfaces/general/general.interface';
// import { calculateHours, formatToUTC, mergeLanguageObjects, parse } from '@/common/utils';
// import { FRONT_URL } from '@/config';
// import { getDistance } from '@/lib/google/google-apis.service';

// import CourseTemplateRepo from '@/modules/courses/repository/courseTemplate.repository';
// import Academy from '@/sequelizeDir/models/academy.model';
// import AssignedRooms from '@/sequelizeDir/models/assignedRooms.model';
// import Company from '@/sequelizeDir/models/company.model';
// import Course from '@/sequelizeDir/models/course.model';
// import CourseAttendanceLog from '@/sequelizeDir/models/courseAttendaceLog.model';
// import CourseAttendanceSheet from '@/sequelizeDir/models/courseAttendaceSheet.model';
// import CourseBundle from '@/sequelizeDir/models/courseBundle.model';
// import CourseLumpSumAmount from '@/sequelizeDir/models/courseLumpsumAmont.model';
// import CourseParticipates from '@/sequelizeDir/models/courseParticipates.model';
// import CourseResources from '@/sequelizeDir/models/courseResources.model';
// import LanguageModel from '@/sequelizeDir/models/language.model';
// import Lesson from '@/sequelizeDir/models/lesson.model';
// import LessonSession from '@/sequelizeDir/models/lessonSession.model';
// import LessonSessionApproval from '@/sequelizeDir/models/lessonSessionApproval.model';
// import Project from '@/sequelizeDir/models/project.model';
// import ProjectQuote from '@/sequelizeDir/models/projectQuote.model';
// import Quotes from '@/sequelizeDir/models/quote.model';
// import QuoteProduct from '@/sequelizeDir/models/quoteProduct.model';
// import TrainerAssignedRoomResources from '@/sequelizeDir/models/trainerAssignedRoomResources.model';
// import { CourseModeEnum, CourseStatus, CourseType } from '@/sequelizeDir/models/types/course.model.type';
// import { AssignedStatus } from '@/sequelizeDir/models/types/lessonSessionApproval.model.type';
// import User from '@/sequelizeDir/models/user.model';
// import { differenceInHours, differenceInMinutes, format, parseISO } from 'date-fns';
// import { Request } from 'express';
// import _, { isObject } from 'lodash';
// import * as qrcode from 'qrcode';
// import { Op, Sequelize } from 'sequelize';
// export const filterData = async (req: Request, data: any, cases: string) => {
//   const courseTemplateRepo = new CourseTemplateRepo();

//   data = parse(data);
//   if (cases === queryBuildCases.default) {
//     data = !_.isEmpty(data) ? parse(data).filter((e: any) => e) : data;
//   }

//   if (cases === queryBuildCases.getAllOrder) {
//     data = !_.isEmpty(data)
//       ? parse(data).filter((e: any) => {
//           if (req?.query?.search) {
//             if (isStringMatched(req?.query?.search, e?.company?.name)) return e;
//           } else return e;
//         })
//       : {};
//   }

//   if (cases === queryBuildCases.getAllCourseManager) {
//     data = !_.isEmpty(data)
//       ? parse(data).map((e: any) => {
//           if (e.card) {
//             e.course_attachments = e?.card?.card_attachments.filter((r) => r?.show_company_manager);
//             delete e?.card;
//           }
//           if (e.card) {
//             e.course_funded_docs = e?.card?.card_attachments.filter((r) => r?.is_funded_documents);
//             delete e?.card;
//           }
//           if (e.projects) {
//             e.project_funded_docs = e?.projects?.card?.card_attachments.filter((r) => r?.is_funded_documents);
//             delete e?.projects;
//           }

//           return e;
//         })
//       : data;
//   }

//   if (cases === queryBuildCases.getCourseBundleTrainerDetails) {
//     const groupedData = _.groupBy(data, 'assignedToUser.id');

//     const courseBundle = await CourseBundle.findOne({
//       where: {
//         slug: req.params.slug,
//       },
//       include: [
//         {
//           model: Academy,
//         },
//       ],
//     });

//     // Mapping grouped data to the desired format
//     data = _.map(groupedData, (value) => ({
//       user: value[0]?.assignedToUser,
//       assignedSession: value.map((item) => _.omit(item, ['assignedToUser'])),
//     }));
//     data = await Promise.all(
//       data.map(async (value) => {
//         const lumpsum = await CourseLumpSumAmount.findOne({
//           where: {
//             trainer_id: value?.user?.id,
//             course_bundle_id: value?.assignedSession[0]?.course_bundle_id,
//           },
//         });
//         value.is_lumpsum_select = false;
//         if (lumpsum) {
//           value.is_lumpsum_select = true;
//           value.reimbursement_amount = lumpsum.reimbursement_amount;
//           value.amount = lumpsum.amount;
//         }
//         if (value.assignedSession) {
//           //totalHours, filteredSlots
//           const h = calculateTotalDurationAndConflicts(value.assignedSession);
//           // course total hours
//           value.user.hours = Number(h?.totalHours) || 0;
//           // hourly charge
//           value.user.trainerHourlyCharge = value?.user?.trainer?.hourly_rate;
//           // total hourly rate
//           value.user.hourlyRate = value.user.trainerHourlyCharge * value.user.hours;
//           // calculate total distance
//           // calculate total days
//           value.user.totalDays = Object.keys(h.filteredSlots).length;

//           const origin = value?.user?.trainer?.location;
//           const destination = courseBundle?.academy?.location;
//           const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
//           const distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;

//           value.user.totalDistance = Number(distanceValue);

//           // calculate trainer reimbursement fees
//           value.user.travelFees = value?.user?.trainer?.travel_reimbursement_fee;

//           // calculate trainer reimbursement fees
//           value.user.totalTravelFees =
//             value.user.travelFees * value.user.totalDistance * value.user.totalDays -
//             Number(value?.user?.trainer?.reimbursement_threshold);

//           // calculate net fees
//           value.user.totalNetFees = value.user.totalTravelFees + value.user.hourlyRate;
//         }

//         if (value.assignedSession) {
//           const assignedSession = parse(value.assignedSession).map((lessonSessionData) => {
//             if (lessonSessionData.is_full_course) {
//               return null;
//             } else if (
//               !lessonSessionData.is_full_course &&
//               !_.isNull(lessonSessionData.lesson_session_id) &&
//               _.isNull(lessonSessionData?.courses)
//             ) {
//               return null;
//             } else if (!lessonSessionData.is_full_course) {
//               return lessonSessionData;
//             }
//           });
//           value.assignedSession = assignedSession.filter(Boolean);
//         }

//         return value;
//       }),
//     );
//     // Mapping grouped data to the desired format
//   }
//   if (cases === queryBuildCases.getAllCalendarEvents) {
//     data = parse(data).map((record) => {
//       record.lessonIndex = record?.course?.lessons.findIndex((e) => e.id === record?.lesson?.id) + 1;
//       return record;
//     });
//   }

//   if (cases === queryBuildCases.getProjectsCardDetails) {
//     const revenue = parse(data)?.project?.project_quotes?.reduce((acc, value) => {
//       acc += value?.quote?.total_amount;
//       return acc;
//     }, 0);
//     const revenueCalculation = parse(data)?.project?.project_quotes?.map((value) => {
//       return value?.quote;
//     });
//     data = {
//       ...data,
//       revenue,
//       revenueCalculation,
//       card_attachments: data?.card_attachments.filter((e) => !e.is_funded_documents),
//       funded_documents: data?.card_attachments.filter((e) => e.is_funded_documents),
//     };
//   }

//   if (cases === queryBuildCases.getCourseCardDetails) {
//     const quoteProduct = [];
//     let revenue = 0;
//     data?.courses.map((course) => {
//       course.projects?.project_quotes.map((projectQuote) => {
//         projectQuote?.quote?.quoteProduct.map((qp) => {
//           if (qp?.code_id === course?.code_id) {
//             //* qp?.units;
//             revenue += qp?.product_total_amount;
//             quoteProduct.push({ quoteProduct: qp, quote: projectQuote?.quote });
//           }
//         });
//       });
//     });

//     data = {
//       ...data,
//       revenue,
//       revenueCalculation: quoteProduct,
//       card_attachments: data?.card_attachments.filter((e) => !e.is_funded_documents),
//       funded_documents: data?.card_attachments.filter((e) => e.is_funded_documents),
//     };
//   }
//   if (cases === queryBuildCases.getChatList) {
//     data = !_.isEmpty(data)
//       ? parse(data).map((e: any) => {
//           if (!_.isNull(e.parentMessage)) {
//             e.multiImageData = [...e.parentMessage];
//             e.multiImageData.push({
//               id: e.id,
//               text: e.text,
//               media_type: e.media_type,
//               sender_id: e.sender_id,
//               room_id: e.room_id,
//               parent_message_id: e.parent_message_id,
//               created_at: e.created_at,
//               media: e.media,
//             });
//             return e;
//           } else return e;
//         })
//       : data;
//   }

//   if (cases === queryBuildCases.getAvailableResources) {
//     const dates = String(req?.query?.dates)
//       .split(',')
//       .map((e) => format(new Date(new Date(e).toUTCString()), 'dd-MM-yyyy'));
//     data = !_.isEmpty(data)
//       ? parse(data).map((e: any) => {
//           const dataOfCourseResource = [];
//           e?.course_resources.map((cr) =>
//             cr.courses?.lessons?.map((l) => {
//               if (l.date) {
//                 const lDate = format(new Date(new Date(l.date).toUTCString()), 'dd-MM-yyyy');

//                 if (dates.includes(lDate)) {
//                   dataOfCourseResource.push({ ...cr, date: lDate });
//                 } else {
//                   return l;
//                 }
//               }
//             }),
//           );
//           if (!_.isEmpty(dataOfCourseResource)) {
//             const minQuantity = dataOfCourseResource.reduce((min, item) => Math.max(min, item.quantity), Number.MIN_VALUE);

//             e.quantity = e.quantity - minQuantity;
//           }
//           delete e?.course_resources;
//           return e;
//         })
//       : data;

//     data = data.filter((d) => !_.isNull(d) && d.quantity > 0);
//   }

//   if (cases === queryBuildCases.getAvailableRooms) {
//     const dates = String(req?.query?.dates)
//       .split(',')
//       .map((e) => formatToUTC(e, 'dd-MM-yyyy'));

//     data = !_.isEmpty(data)
//       ? parse(data).map((e: any) => {
//           const dataOfCourseRoom = [];
//           e?.assigned_rooms.map((cr) =>
//             cr.courses?.lessons?.map((l) => {
//               if (l.date) {
//                 const lDate = formatToUTC(l.date, 'dd-MM-yyyy');

//                 if (dates.includes(lDate)) {
//                   dataOfCourseRoom.push({ ...cr, date: lDate });
//                 } else {
//                   return l;
//                 }
//               }
//             }),
//           );
//           if (!_.isEmpty(dataOfCourseRoom)) {
//             return null;
//           } else {
//             delete e?.assigned_rooms;
//             return e;
//           }
//         })
//       : data;

//     data = data.filter((d) => !_.isNull(d));
//   }

//   if (cases === queryBuildCases.getAllCourseRoomBundle) {
//     data = !_.isEmpty(data)
//       ? parse(data).map((e: any) => {
//           return e;
//         })
//       : data;
//   }
//   if (cases === queryBuildCases.getAllCertificateTemplate) {
//     data = !_.isEmpty(data)
//       ? parse(data).map((e: any) => {
//           e.latest_version = e.latest_version ? e.latest_version : 1;

//           return e;
//         })
//       : data;
//     if (req?.query?.search) {
//       data = parse(data).filter((e) => {
//         if (isStringMatched(req?.query?.search, e?.title)) return e;
//       });
//     }
//   }
//   if (cases === queryBuildCases.getAllCourseTemplate) {
//     data = !_.isEmpty(data)
//       ? parse(data).map((course: any) => {
//           course.main_resources = [];
//           course.optional_resources = [];

//           course.course_resources.forEach((resources) => {
//             if (resources.is_optional)
//               course.optional_resources.push({
//                 resource_id: resources?.resource_id,
//                 quantity: resources?.quantity,
//                 title: resources?.resources?.title,
//               });
//             else {
//               course.main_resources.push({
//                 resource_id: resources?.resource_id,
//                 quantity: resources?.quantity,
//                 title: resources?.resources?.title,
//               });
//             }
//           });
//           return course;
//         })
//       : data;
//   }

//   if (cases === queryBuildCases.getAllCourseBundleInvitationOfTrainer) {
//     data = !_.isEmpty(data)
//       ? parse(data).map((lessonSessionApproval: any) => {
//           if (
//             !_.isNull(lessonSessionApproval.lesson_session_id) &&
//             !_.isNull(lessonSessionApproval.course_id) &&
//             _.isNull(lessonSessionApproval.courses)
//           ) {
//             return null;
//           }
//           return lessonSessionApproval;
//         })
//       : data;
//     data = data.filter(Boolean);
//   }

//   if (cases === queryBuildCases.getAllCourseBundlesInvitationOfTrainer) {
//     const bundleCal = data ? calculateTotalDurationAndConflicts(data) : { totalHours: 0, filteredSlots: [] };
//     let courseBundle = null;
//     if (req?.query?.course_bundle_id) {
//       courseBundle = await CourseBundle.findOne({
//         where: {
//           id: Number(req?.query?.course_bundle_id),
//         },
//         include: [
//           {
//             model: Academy,
//           },
//         ],
//       });
//     }

//     data = !_.isEmpty(data)
//       ? parse(data).map((lessonSessionApproval: any) => {
//           if (lessonSessionApproval.is_full_course) {
//             return null;
//           }
//           return lessonSessionApproval;
//         })
//       : data;

//     data = data.filter(Boolean);
//     data = await Promise.all(
//       data.map(async (value) => {
//         const lumpsum = await CourseLumpSumAmount.findOne({
//           where: {
//             trainer_id: req?.tokenData?.user?.id,
//             course_bundle_id: Number(req?.query?.course_bundle_id),
//           },
//         });
//         value.is_lumpsum_select = false;
//         if (lumpsum) {
//           value.is_lumpsum_select = true;
//           value.reimbursement_amount = lumpsum.reimbursement_amount;
//           value.amount = lumpsum.amount;
//         }
//         if (req?.query?.course_bundle_id) {
//           value.user = value?.assignedToUser;
//           value.hours = bundleCal.totalHours;
//           value.trainerHourlyCharge = value?.user?.trainer?.hourly_rate;
//           // total hourly rate
//           value.hourlyRate = value.trainerHourlyCharge * value.hours;
//           // calculate total distance
//           // calculate total days
//           value.totalDays = Object.keys(bundleCal.filteredSlots).length;

//           const origin = value?.user?.trainer?.location;
//           const destination = courseBundle?.academy?.location;
//           const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
//           const distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;

//           value.totalDistance = Number(distanceValue);

//           // calculate trainer reimbursement fees
//           value.travelFees = value?.user?.trainer?.travel_reimbursement_fee;

//           // calculate trainer reimbursement fees
//           value.totalTravelFees =
//             value.travelFees * value.totalDistance * value.totalDays -
//             (Number(value?.user?.trainer?.reimbursement_threshold) || 0);

//           // calculate net fees
//           value.totalNetFees = value.totalTravelFees + value.hourlyRate;
//         }
//         return value;
//       }),
//     );
//   }
//   if (cases === queryBuildCases.getAllCourseUsedBundleData) {
//     data = !_.isEmpty(data)
//       ? parse(data).map((course: any) => {
//           // if (req?.query?.editView) {
//           const lessonApproval = [];
//           const main_trainers = [];
//           const optional_trainers = [];
//           course.optional_rooms = [];
//           course.main_rooms = [];
//           course.main_resources = [];
//           course.optional_resources = [];
//           if (course.lesson_session_approval) {
//             course.lesson_session_approval.forEach((lessonSessionData) => {
//               if (lessonSessionData.is_optional) {
//                 optional_trainers.push({
//                   assigned_to_status: lessonSessionData?.assigned_to_status,
//                   assignedToUser:
//                     lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                   id: lessonSessionData?.assignedToUser?.id,
//                   is_full_course: lessonSessionData.is_full_course,
//                   is_optional: lessonSessionData.is_optional,
//                 });
//               } else {
//                 main_trainers.push({
//                   assigned_to_status: lessonSessionData?.assigned_to_status,
//                   assignedToUser:
//                     lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                   id: lessonSessionData?.assignedToUser?.id,
//                   is_full_course: lessonSessionData?.is_full_course,
//                   is_optional: lessonSessionData?.is_optional,
//                 });
//               }
//             });
//           }
//           course?.assigned_rooms?.forEach((rooms) => {
//             if (rooms.is_optional) course.optional_rooms.push(rooms.room_id);
//             else course.main_rooms.push(rooms.room_id);
//           });
//           course?.course_resources?.forEach((resources) => {
//             if (resources.is_optional)
//               course.optional_resources.push({
//                 resource_id: resources.resource_id,
//                 quantity: resources.quantity,
//                 title: resources.resources?.title,
//               });
//             else
//               course.main_resources.push({
//                 resource_id: resources.resource_id,
//                 quantity: resources.quantity,
//                 title: resources.resources?.title,
//               });
//             // if (resources.is_optional) course.optional_resources.push(resources.resource_id);
//             // else course.main_resources.push(resources.resource_id);
//           });
//           delete course.lessonSessionApproval;

//           course.lessonApproval = [...lessonApproval, ...main_trainers, ...optional_trainers];
//           course.main_trainers = main_trainers.map((e) => ({ assigned_to: e.id, is_lesson_trainer: e.is_lesson_trainer }));
//           course.optional_trainers = optional_trainers.map((e) => ({
//             assigned_to: e.id,
//             is_lesson_trainer: e.is_lesson_trainer,
//           }));
//           // }
//           if (_.isUndefined(req?.query?.tableView) || !req?.query?.tableView) {
//             course = setCourseData(course);
//           }
//           return course;
//         })
//       : data;
//   }

//   if (cases === queryBuildCases.getAllCourse) {
//     if (!req?.query?.filterView) {
//       data = parse(data).map((course) => {
//         const lessonApproval = [];
//         const main_trainers = [];
//         const optional_trainers = [];
//         const valid_optional_trainers = [];
//         course.optional_rooms = [];
//         course.main_rooms = [];
//         course.main_rooms_data = [];
//         course.optional_rooms_data = [];
//         course.main_resources = [];
//         course.optional_resources = [];
//         course.lessonSessionApproval.forEach((lsa: LessonSessionApproval) => {
//           if (lsa.is_optional && !lsa.lesson_session_id && lsa.assigned_to_status === AssignedStatus.Accepted) {
//             const room = lsa.trainerAssignedRoomResources.find((tarr) => tarr.course_room_id)?.courseRoom;
//             const resources = lsa.trainerAssignedRoomResources
//               .filter((tarr) => tarr.course_resource_id)
//               .map((tarr) => tarr.resource);

//             valid_optional_trainers.push({
//               ...lsa,
//               room,
//               resources,
//             });
//           }
//         });

//         course.lessonSessionApproval.forEach((lessonSessionData) => {
//           if (lessonSessionData.is_full_course && _.isNull(lessonSessionData.lesson_session_id)) {
//             if (lessonSessionData.is_optional) {
//               optional_trainers.push({
//                 profile_image: lessonSessionData?.assignedToUser?.profile_image,
//                 assigned_to_status: lessonSessionData?.assigned_to_status,
//                 assignedToUser:
//                   lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                 id: lessonSessionData?.assignedToUser?.id,
//                 is_full_course: lessonSessionData.is_full_course,
//                 is_optional: lessonSessionData.is_optional,
//                 is_lesson_trainer: lessonSessionData.is_lesson_trainer,
//               });
//             } else {
//               main_trainers.push({
//                 profile_image: lessonSessionData?.assignedToUser?.profile_image,
//                 assigned_to_status: lessonSessionData?.assigned_to_status,
//                 assignedToUser:
//                   lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                 id: lessonSessionData?.assignedToUser?.id,
//                 is_full_course: lessonSessionData.is_full_course,
//                 is_optional: lessonSessionData.is_optional,
//                 is_lesson_trainer: lessonSessionData.is_lesson_trainer,
//               });
//             }
//           }
//         });
//         // if (_.isUndefined(req?.query?.tableView)) {
//         course.assigned_rooms.forEach((rooms) => {
//           if (rooms.is_optional) {
//             course.optional_rooms.push(rooms.room_id);
//             course.main_rooms_data.push({
//               ...rooms,
//               maximum_participate: rooms?.course_room?.maximum_participate,
//               title: rooms?.course_room?.title,
//             });
//           } else {
//             course.main_rooms.push(rooms.room_id);
//             course.main_rooms_data.push({
//               ...rooms,
//               maximum_participate: rooms?.course_room?.maximum_participate,
//               title: rooms?.course_room?.title,
//             });
//           }
//         });
//         course.course_resources.forEach((resources) => {
//           if (resources.is_optional)
//             course.optional_resources.push({
//               resource_id: resources.resource_id,
//               quantity: resources.quantity,
//               title: resources.resources?.title,
//             });
//           else {
//             course.main_resources.push({
//               resource_id: resources.resource_id,
//               quantity: resources.quantity,
//               title: resources.resources?.title,
//             });
//           }
//         });
//         // }

//         delete course.lessonSessionApproval;
//         course.lessons.forEach((lesson) => {
//           lesson.lesson_sessions.forEach((session) => {
//             session.lessonSessionApproval.forEach((lessonSessionData) => {
//               if (!lessonSessionData.is_full_course) {
//                 lessonApproval.push({
//                   assigned_to_status: lessonSessionData?.assigned_to_status,
//                   assignedToUser:
//                     lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                   profile_image: lessonSessionData?.assignedToUser?.profile_image,
//                   id: lessonSessionData?.assignedToUser?.id,
//                   is_lesson_trainer: lessonSessionData.is_lesson_trainer,
//                   is_full_course: lessonSessionData.is_full_course,
//                   is_optional: lessonSessionData.is_optional,
//                 });
//                 session.assigned_to = lessonSessionData?.assignedToUser?.id;
//               }
//             });

//             delete session.lessonSessionApproval;
//           });
//         });
//         if (course.assigned_rooms) delete course.assigned_rooms;
//         if (course.course_resources) delete course.course_resources;
//         course.lessonApproval = [...lessonApproval, ...main_trainers, ...optional_trainers];
//         course.main_trainers = main_trainers.map((e) => ({ assigned_to: e.id, is_lesson_trainer: e.is_lesson_trainer }));
//         course.optional_trainers = optional_trainers.map((e) => ({ assigned_to: e.id, is_lesson_trainer: e.is_lesson_trainer }));
//         course.valid_optional_trainers = valid_optional_trainers;
//         return course;
//       });
//       data = parse(data).map((course) => {
//         // if (course.type === CourseType.Private) {
//         course.card_members = course?.card?.card_members || [];
//         course.companies = course?.projects?.card?.card_Company || [];
//         // }
//         delete course.card;
//         return course;
//       });
//       data = await Promise.all(
//         parse(data).map(async (course) => {
//           if (course.type === CourseType.Private) {
//             const projectQuote = await ProjectQuote.findAll({
//               where: {
//                 project_id: course?.project_id,
//               },
//               include: [
//                 {
//                   model: Quotes,
//                 },
//               ],
//             });
//             let funded_by_data = [];

//             for (const ele of projectQuote) {
//               if (ele?.quote?.funded_by) {
//                 const eleData = ele?.quote?.funded_by.split(',');
//                 const differenceData = _.difference(eleData, funded_by_data);
//                 if (ele && differenceData.length > 0) {
//                   funded_by_data = [...funded_by_data, ...differenceData];
//                 }
//               }
//             }
//             course.funded_by = funded_by_data.join(',');
//           }
//           return course;
//         }),
//       );
//     }
//   }
//   if (cases === queryBuildCases.getAllAssignedTrainersOfCourse) {
//     data = parse(data).map((course) => {
//       const main_trainers = [];
//       const optional_trainers = [];
//       const sessions = [];
//       course.lessonSessionApproval.forEach((lessonSessionData) => {
//         if (
//           lessonSessionData.is_full_course &&
//           _.isNull(lessonSessionData.lesson_session_id) &&
//           lessonSessionData.assigned_to_status === AssignedStatus.Accepted
//         ) {
//           if (lessonSessionData.is_optional) {
//             optional_trainers.push({
//               profile_image: lessonSessionData?.assignedToUser?.profile_image,
//               assigned_to_status: lessonSessionData?.assigned_to_status,
//               assignedToUser: lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//               id: lessonSessionData?.assignedToUser?.id,
//               is_full_course: lessonSessionData.is_full_course,
//               is_optional: lessonSessionData.is_optional,
//               is_lesson_trainer: lessonSessionData.is_lesson_trainer,
//             });
//           } else {
//             main_trainers.push({
//               profile_image: lessonSessionData?.assignedToUser?.profile_image,
//               assigned_to_status: lessonSessionData?.assigned_to_status,
//               assignedToUser: lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//               id: lessonSessionData?.assignedToUser?.id,
//               is_full_course: lessonSessionData.is_full_course,
//               is_optional: lessonSessionData.is_optional,
//               is_lesson_trainer: lessonSessionData.is_lesson_trainer,
//             });
//           }
//         }
//       });

//       delete course.lessonSessionApproval;
//       course.lessons.forEach((lesson) => {
//         lesson.lesson_sessions.forEach((session) => {
//           session.lessonSessionApproval.map((lessonSessionData) => {
//             if (lessonSessionData.assigned_to_status === AssignedStatus.Accepted && lessonSessionData.available) {
//               return {
//                 assigned_to_status: lessonSessionData?.assigned_to_status,
//                 assignedToUser:
//                   lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                 profile_image: lessonSessionData?.assignedToUser?.profile_image,
//                 id: lessonSessionData?.assignedToUser?.id,
//                 is_lesson_trainer: lessonSessionData.is_lesson_trainer,
//                 is_full_course: lessonSessionData.is_full_course,
//                 is_optional: lessonSessionData.is_optional,
//               };
//             }
//             return null;
//           });
//           session.lessonSessionApproval.filter((e) => !_.isNull(e));
//         });
//       });

//       course.main_trainers = main_trainers;
//       course.optional_trainers = optional_trainers;

//       return course;
//     });
//   }

//   if (cases === queryBuildCases.getCourseRoomResourceData) {
//     const course = parse(data) as Course;

//     const alreadyAssignedRooms: number[] = [];
//     const alreadyAssignedResourceQtyMap: { [key: number]: { qty: number } } = {};

//     course.trainer_assigned_room_resources.forEach((tarr) => {
//       if (tarr.course_room_id) {
//         alreadyAssignedRooms.push(tarr.course_room_id);
//       }

//       if (tarr.resource_id) {
//         alreadyAssignedResourceQtyMap[tarr.resource_id] = {
//           qty: tarr.quantity + (alreadyAssignedResourceQtyMap[tarr.resource_id]?.qty || 0),
//         };
//       }
//     });

//     //available rooms
//     const mainRooms: { id: number; title: string }[] = [];
//     const optionalRoom: { id: number; title: string }[] = [];

//     course.assigned_rooms.forEach((assignedRoom) => {
//       if (assignedRoom.is_optional && !alreadyAssignedRooms.includes(assignedRoom.room_id)) {
//         optionalRoom.push({ id: assignedRoom.course_room.id, title: assignedRoom.course_room.title });
//       } else if (!assignedRoom.is_optional) {
//         mainRooms.push({ id: assignedRoom.course_room.id, title: assignedRoom.course_room.title });
//       }
//     });

//     //available resources
//     const mainResources: { id: number; title: string; totalQty: number; usedQty: number }[] = [];
//     const optionalResources: { id: number; title: string; totalQty: number; usedQty: number }[] = [];

//     let totalOptionalResources = 0;
//     course.course_resources.forEach((courseResource) => {
//       const resource = alreadyAssignedResourceQtyMap[courseResource.resource_id];

//       if (courseResource.is_optional) {
//         optionalResources.push({
//           id: courseResource.resources.id,
//           title: courseResource.resources.title,
//           totalQty: courseResource.quantity,
//           usedQty: resource?.qty || 0,
//         });
//         totalOptionalResources += courseResource.quantity;
//       } else {
//         mainResources.push({
//           id: courseResource.resources.id,
//           title: courseResource.resources.title,
//           totalQty: courseResource.quantity,
//           usedQty: resource?.qty || 0,
//         });
//       }
//     });

//     const trainerRoomAndUsers: {
//       [key: string]: {
//         assignedTo: User;
//         room: { id: number; title: string };
//         resources: { id: number; title: string; usedQty: number }[];
//       };
//     } = {};

//     course.lessonSessionApproval.forEach((lsa: LessonSessionApproval & { assignedToUser: User }) => {
//       const assignedRoom: { id: number; title: string } = { id: null, title: '' };
//       const assignedResources: { id: number; title: string; usedQty: number }[] = [];

//       lsa.trainerAssignedRoomResources.forEach((tarr) => {
//         if (tarr.course_room_id) {
//           assignedRoom.id = tarr.courseRoom.id;
//           assignedRoom.title = tarr.courseRoom.title;
//         }

//         if (tarr.resource_id) {
//           assignedResources.push({
//             id: tarr.resource.id,
//             title: tarr.resource.title,
//             usedQty: tarr.quantity,
//           });
//         }

//         trainerRoomAndUsers[lsa.assignedToUser?.id] = {
//           assignedTo: lsa.assignedToUser,
//           room: assignedRoom,
//           resources: assignedResources,
//         };
//       });
//     });

//     //Add other trainers
//     course.lessonSessionApproval.forEach((lsa: LessonSessionApproval & { assignedToUser: User }) => {
//       if (
//         !trainerRoomAndUsers[lsa.assignedToUser?.id] &&
//         (lsa.assigned_to_status === AssignedStatus.Accepted || lsa.assignedToUser?.id === Number(req.query?.trainer_id))
//       ) {
//         trainerRoomAndUsers[lsa.assignedToUser?.id] = {
//           assignedTo: lsa.assignedToUser,
//           room: null,
//           resources: [],
//         };
//       }
//     });

//     const trainerRoomAndUsersArr = Object.values(trainerRoomAndUsers);

//     return {
//       mainRooms,
//       optionalRoom,
//       mainResources,
//       optionalResources,
//       totalOptionalResources,
//       isResourceAvaliableForEachTrainer: totalOptionalResources >= trainerRoomAndUsersArr.length,
//     };
//   }
//   if (cases === queryBuildCases.getCourseTrainerDetails) {
//     const courseData = await Course.findOne({
//       where: { id: Number(req?.query?.course_id) },
//       attributes: [
//         'id',
//         'type',
//         'price',
//         'parent_table_id',
//         [
//           Sequelize.literal(
//             `(select  SUM(TIMESTAMPDIFF(HOUR, start_time, end_time)) AS difference from lesson_sessions ls where course_id=Course.id)`,
//           ),
//           'hours',
//         ],
//       ],
//       include: [
//         {
//           model: Lesson,
//           attributes: ['id'],
//         },
//         {
//           model: CourseParticipates,
//           where: { language: req?.language },
//           required: false,
//         },
//         {
//           model: Project,
//           as: 'projects',
//           attributes: ['id', 'card_id'],
//           include: [
//             {
//               model: ProjectQuote,
//               attributes: ['id'],
//               include: [
//                 {
//                   model: Quotes,
//                   attributes: ['id'],
//                   include: [
//                     {
//                       model: QuoteProduct,
//                       attributes: ['id', 'code_id', 'product_total_amount', 'units'],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });
//     let defaultCourse = courseData;
//     if (courseData.parent_table_id !== null) {
//       const defaultLanguage = await LanguageModel.findOne({ where: { is_default: true } });
//       if (defaultLanguage) {
//         defaultCourse = await Course.findOne({
//           where: {
//             parent_table_id: courseData?.parent_table_id,
//             language: defaultLanguage?.name,
//           },
//         });
//       }
//     }
//     let totalDistance = 0;

//     data = await Promise.all(
//       parse(data).map(async (lessonSessionData) => {
//         if (
//           lessonSessionData?.lessonSessions?.lesson &&
//           lessonSessionData?.lessonSessions?.lesson?.mode !== CourseModeEnum.VideoConference
//         ) {
//           const origin = (lessonSessionData as LessonSessionApproval)?.assignedToUser?.trainer?.location;
//           const destination = lessonSessionData?.lessonSessions?.lesson?.location;

//           const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
//           const distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;
//           totalDistance += distanceValue;
//         }
//         if (lessonSessionData.is_full_course && _.isNull(lessonSessionData.lesson_session_id)) {
//           return lessonSessionData;
//         } else if (lessonSessionData.is_full_course && !_.isNull(lessonSessionData.lesson_session_id)) {
//           const lessonSessionAcceptedUser = await LessonSessionApproval.findAll({
//             where: {
//               lesson_session_id: lessonSessionData?.lesson_session_id,
//               $assigned_to_status$: AssignedStatus.Accepted,
//               trainer_assigned_to_status: AssignedStatus.Accepted,
//               is_full_course: true,
//               is_optional: lessonSessionData?.is_optional,
//             },
//             attributes: ['id'],
//             include: [{ model: User, attributes: ['id', 'first_name', 'last_name', 'profile_image'] }],
//           });

//           lessonSessionData.selected_users = lessonSessionAcceptedUser;
//           return lessonSessionData;
//         } else if (!lessonSessionData.is_full_course && !_.isNull(lessonSessionData.lesson_session_id)) {
//           return lessonSessionData;
//         }
//       }),
//     );
//     data = data.filter(Boolean);
//     const groupedData = _.groupBy(data, 'assignedToUser.id');

//     // Mapping grouped data to the desired format
//     data = _.map(groupedData, (value) => ({
//       user: value[0]?.assignedToUser,
//       assignedSession: value.map((item) => _.omit(item, ['assignedToUser'])),
//     }));
//     data = await Promise.all(
//       data.map(async (value) => {
//         let totalDistanceData = 0;
//         const lessonIds = [];

//         const userAssignedLessons = [];
//         for (const lessonSessionData of value.assignedSession) {
//           if (
//             lessonSessionData?.lessonSessions?.lesson &&
//             lessonSessionData?.lessonSessions?.lesson?.mode !== CourseModeEnum.VideoConference &&
//             [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//               (lessonSessionData as LessonSessionApproval).assigned_to_status,
//             ) &&
//             [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//               (lessonSessionData as LessonSessionApproval).trainer_assigned_to_status,
//             ) &&
//             (lessonSessionData as LessonSessionApproval)?.available
//           ) {
//             const origin = value?.user?.trainer?.location;
//             const destination = lessonSessionData?.lessonSessions?.lesson?.location;

//             const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
//             const distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;
//             if (!lessonIds.includes(lessonSessionData?.lesson_id)) totalDistanceData += distanceValue;
//             userAssignedLessons.push({ ...lessonSessionData, distance: distanceValue });
//             lessonIds.push(lessonSessionData.lesson_id);
//           } else {
//             userAssignedLessons.push({ ...lessonSessionData });
//           }
//         }
//         value.assignedSession = userAssignedLessons;
//         const lumpsum = await CourseLumpSumAmount.findOne({
//           where: {
//             trainer_id: value.user.id,
//             course_id: defaultCourse?.id,
//           },
//         });

//         value.is_lumpsum_select = false;
//         if (lumpsum) {
//           value.is_lumpsum_select = true;
//           value.reimbursement_amount = lumpsum.reimbursement_amount;
//           value.amount = lumpsum.amount;
//         }

//         const hasFullApproval = value.assignedSession.find((lsa) => lsa.is_full_course && !lsa.lesson_session_id);

//         if (
//           hasFullApproval &&
//           [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//             (hasFullApproval as LessonSessionApproval).trainer_assigned_to_status,
//           ) &&
//           [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//             (hasFullApproval as LessonSessionApproval).assigned_to_status,
//           ) &&
//           hasFullApproval.available
//         ) {
//           // course total hours
//           value.user.hours = Number(parse(courseData)?.hours) || 0;
//         } else {
//           const hours = value.assignedSession.reduce((h, lsa) => {
//             if (
//               [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//                 (lsa as LessonSessionApproval).trainer_assigned_to_status,
//               ) &&
//               [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//                 (lsa as LessonSessionApproval).assigned_to_status,
//               ) &&
//               (lsa as LessonSessionApproval)?.available
//             )
//               h += differenceInHours(parseISO(lsa?.lessonSessions?.end_time), parseISO(lsa?.lessonSessions?.start_time));
//             return h;
//           }, 0);
//           // course total hours
//           value.user.hours = Number(hours) || 0;
//         }

//         // hourly charge
//         value.user.trainerHourlyCharge = value?.user?.trainer?.hourly_rate;
//         // total hourly rate
//         value.user.hourlyRate = value.user.trainerHourlyCharge * value.user.hours;
//         // calculate total distance
//         value.user.totalDistance = totalDistanceData;

//         // calculate total days
//         value.user.totalDays = courseData?.lessons?.length;

//         // calculate trainer reimbursement fees
//         value.user.travelFees = value?.user?.trainer?.travel_reimbursement_fee;

//         // calculate trainer reimbursement fees
//         value.user.totalTravelFees =
//           value.user.travelFees * value.user.totalDistance - Number(value?.user?.trainer?.reimbursement_threshold);

//         // calculate net fees
//         value.user.totalNetFees = value.user.totalTravelFees + value.user.hourlyRate;
//         /**
//          * private
//          * Course Price: 0
//          * quotes product price sum
//          * */
//         // Profitability
//         value.user.coursePrice = courseData.price;
//         value.user.courseRevenue = courseData.price;
//         if (courseData.type === CourseType.Private) {
//           let revenue = 0;
//           courseData.projects?.project_quotes.map((projectQuote) => {
//             projectQuote?.quote?.quoteProduct.map((qp) => {
//               if (qp?.code_id === courseData?.code_id) {
//                 //* qp?.units;
//                 revenue += qp?.product_total_amount;
//               }
//             });
//             value.user.courseRevenue = revenue;
//           });
//         }

//         if (courseData.type === CourseType.Academy) {
//           value.user.courseRevenue = courseData.course_participates.length * value.user.courseRevenue;
//         }
//         value.user.totalParticipate = courseData.course_participates.length;

//         // const profitability
//         value.user.profit =
//           value.user.courseRevenue > 0 ? Number(value.user.courseRevenue - value.user.totalFees / value.user.courseRevenue) : 0;
//         return {
//           ...value,
//         };
//       }),
//     );
//   }

//   if (cases === queryBuildCases.getTrainerLossDashboard) {
//     let totalDistance = 0;

//     let totalDays = 0;
//     data = await Promise.all(
//       parse(data).map(async (lessonSessionData) => {
//         if (lessonSessionData?.lessons?.mode !== CourseModeEnum.VideoConference) {
//           const origin = (lessonSessionData as LessonSessionApproval)?.assignedToUser?.trainer?.location;
//           const destination = lessonSessionData?.lessonSessions?.lesson?.location;

//           const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
//           const distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;

//           // REMAINING: google api
//           totalDistance += distanceValue;
//           totalDays += 1;
//         }
//         if (lessonSessionData.is_full_course && _.isNull(lessonSessionData.lesson_session_id)) {
//           // full course data
//           return lessonSessionData;
//         } else if (lessonSessionData.is_full_course && !_.isNull(lessonSessionData.lesson_session_id)) {
//           return null;
//         } else if (!lessonSessionData.is_full_course && !_.isNull(lessonSessionData.lesson_session_id)) {
//           // session wise data
//           return lessonSessionData;
//         }
//       }),
//     );
//     data = data.filter(Boolean);
//     data = await Promise.all(
//       data.map(async (value) => {
//         value.is_lumpsum_select = false;

//         // course total hours
//         value.assignedToUser.hours = value?.hours ?? 0;

//         // hourly charge
//         value.assignedToUser.trainerHourlyCharge = value?.assignedToUser?.trainer?.hourly_rate;
//         // // total hourly rate
//         value.assignedToUser.hourlyRate = value.assignedToUser.trainerHourlyCharge * value.assignedToUser.hours;
//         // // calculate total distance
//         value.assignedToUser.totalDistance = totalDistance;

//         // // calculate total days
//         value.assignedToUser.totalDays = totalDays;

//         // // calculate trainer reimbursement fees
//         value.assignedToUser.travelFees = value?.assignedToUser?.trainer.travel_reimbursement_fee;

//         // // calculate trainer reimbursement fees
//         value.assignedToUser.totalTravelFees = value.assignedToUser.travelFees * value.assignedToUser.totalDistance;

//         // // calculate net fees
//         value.assignedToUser.totalNetFees = value.assignedToUser.totalTravelFees + value.assignedToUser.trainerHourlyCharge;
//         /**
//          * private
//          * Course Price: 0
//          * quotes product price sum
//          * */
//         // Profitability
//         value.assignedToUser.coursePrice = value?.courses?.price ?? 0;
//         value.assignedToUser.courseRevenue = value?.courses?.price ?? 0;

//         if (value?.courses?.type === CourseType.Academy) {
//           value.assignedToUser.courseRevenue = value?.courses?.course_participates?.length * value.assignedToUser.courseRevenue;
//         }
//         value.assignedToUser.totalParticipate = value?.courses?.course_participates.length;

//         // const profitability
//         value.assignedToUser.profit =
//           value?.assignedToUser?.courseRevenue > 0
//             ? Number(value.assignedToUser?.courseRevenue - value.assignedToUser?.totalFees / value.assignedToUser?.courseRevenue)
//             : 0;
//         return {
//           ...value,
//         };
//       }),
//     );
//   }

//   if (cases === queryBuildCases.getAllCourseTemplateForDropdown) {
//     data = await Promise.all(
//       parse(data).map(async (course) => {
//         // course.optional_rooms = [];
//         // course.main_rooms = [];
//         course.main_resources = [];
//         course.optional_resources = [];
//         // course.assigned_rooms.forEach((rooms) => {
//         //   if (rooms.is_optional) course.optional_rooms.push(rooms.room_id);
//         //   else course.main_rooms.push(rooms.room_id);
//         // });
//         course.course_resources.forEach((resources) => {
//           if (resources.is_optional)
//             course.optional_resources.push({
//               resource_id: resources.resource_id,
//               quantity: resources.quantity,
//               title: resources.resources.title,
//             });
//           else {
//             course.main_resources.push({
//               resource_id: resources.resource_id,
//               quantity: resources.quantity,
//               title: resources.resources.title,
//             });
//           }
//         });
//         course = await courseTemplateRepo.formObjectTemplate(course);
//         return course;
//       }),
//     );
//   }
//   if (cases === queryBuildCases.getAllCourseInvitationOfTrainer) {
//     data = parse(data).map((course) => {
//       const lessonApproval = [];

//       const sessions = [];

//       const main_trainers = [];
//       const optional_trainers = [];
//       course.lessonSessionApproval.forEach((lessonSessionData) => {
//         if (_.isNull(course.course_bundle_id)) {
//           if (lessonSessionData.is_full_course) {
//             if (lessonSessionData.is_optional) {
//               optional_trainers.push({
//                 assigned_to_status: lessonSessionData?.assigned_to_status,
//                 assignedToUser:
//                   lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                 id: lessonSessionData?.assignedToUser?.id,
//                 lesson_session_id: lessonSessionData?.lesson_session_id,
//                 assign_to: lessonSessionData?.assigned_to,
//                 is_full_course: lessonSessionData.is_full_course,
//                 is_optional: lessonSessionData.is_optional,
//                 ...lessonSessionData,
//               });
//             } else {
//               main_trainers.push({
//                 assigned_to_status: lessonSessionData?.assigned_to_status,
//                 assignedToUser:
//                   lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                 id: lessonSessionData?.assignedToUser?.id,
//                 lesson_session_id: lessonSessionData?.lesson_session_id,
//                 is_full_course: lessonSessionData.is_full_course,
//                 is_optional: lessonSessionData.is_optional,
//                 ...lessonSessionData,
//               });
//             }
//           }
//         }
//       });
//       if (!_.isNull(course.course_bundle_id)) course.lessonSessionApproval = [];
//       // delete course.lessonSessionApproval;

//       course.lessons.forEach((lesson) => {
//         lesson.lesson_sessions.forEach((session) => {
//           session.lessonSessionApproval = session.lessonSessionApproval.filter((e) => e.is_full_course === false);
//           session.lessonSessionApproval.forEach(async (lessonSessionData) => {
//             if (lessonSessionData.is_full_course === false) {
//               lessonApproval.push({
//                 assigned_to_status: lessonSessionData?.assigned_to_status,
//                 assign_to: lessonSessionData?.assigned_to,
//                 lesson_session_id: lessonSessionData?.lesson_session_id,
//                 assignedToUser:
//                   lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//                 id: lessonSessionData?.assignedToUser?.id,
//                 is_full_course: lessonSessionData.is_full_course,
//                 is_optional: lessonSessionData.is_optional,
//                 ...lessonSessionData,
//               });

//               if (!_.isNull(session.lessonSessionApproval[0].course_bundle_id)) {
//                 lessonSessionData.trainerHourlyCharge = req?.tokenData?.user?.trainer?.hourly_rate;
//                 lessonSessionData.travelFees = req?.tokenData?.user?.trainer?.travel_reimbursement_fee;

//                 lessonSessionData.hours = differenceInHours(parseISO(session?.end_time), parseISO(session?.start_time));

//                 lessonSessionData.totalDays = 1;
//                 let distanceValue = 0;

//                 if (lessonSessionData?.lessons && lessonSessionData?.lessons?.mode !== CourseModeEnum.VideoConference) {
//                   const origin = (lessonSessionData as LessonSessionApproval)?.assignedToUser?.trainer?.location;
//                   const destination = lessonSessionData?.lessons?.location;

//                   const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
//                   distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;
//                 }

//                 lessonSessionData.totalDistance = distanceValue;

//                 lessonSessionData.totalTravelFees = lessonSessionData.travelFees * lessonSessionData.totalDistance;
//                 lessonSessionData.mode = lessonSessionData?.lessons?.mode;
//                 lessonSessionData.totalNetFees = lessonSessionData.totalTravelFees + lessonSessionData.trainerHourlyCharge;
//                 lessonSessionData.is_lumpsum_select = false;
//                 lessonSessionData.totalNetFees = lessonSessionData.totalTravelFees + lessonSessionData.trainerHourlyCharge;
//               }

//               session.assigned_to = lessonSessionData?.assignedToUser?.id;
//             }
//           });
//           session.lessonTitle = lesson.title;
//           session.lessonSlug = lesson.slug;
//           session.lessonId = lesson.id;
//           session.lessonDate = lesson.date;
//           if (!_.isEmpty(session.lessonSessionApproval) && !_.isNull(session.lessonSessionApproval[0].course_bundle_id))
//             sessions.push(session);
//           // delete session.lessonSessionApproval;
//         });
//       });

//       course.lessonApproval = [...lessonApproval, ...main_trainers, ...optional_trainers];

//       if (!_.isNull(course.course_bundle_id)) course.lessonApproval = [...lessonApproval];
//       delete course.lessons;
//       course.sessions = sessions;
//       return course;
//     });

//     data = data.filter((e) => !_.isEmpty(e.lessonApproval));
//   }

//   if (cases === queryBuildCases.getAllCodes) {
//     if (req?.query?.quote_id) {
//       data = parse(data).filter((d) => !_.isEmpty(d?.courses) || !_.isEmpty(d?.codeProduct));
//     }

//     if (req.query.assignedCourses) {
//       data = parse(data).filter((d) => !_.isEmpty(d?.courses));
//     }
//     if (req.query.includeOthers) {
//       data = parse(data).filter((d) => !_.isEmpty(d?.courses) || d?.course_code_type === CodeTypeEnum.general);
//     }
//     if (req?.query.unassignedCourses) {
//       data = parse(data).filter((d) => _.isEmpty(d?.courses));
//     }
//   }
//   if (cases === queryBuildCases.getQROfExam) {
//     data = await Promise.all(
//       parse(data).map(async (d) => {
//         d.exam = await Promise.all(
//           d.exam.map(async (e) => {
//             e.url = `${e.url}?trainer_slug=${req?.tokenData?.user?.username}`;
//             e.qr_string = await qrcode.toDataURL(`${FRONT_URL}/${e.url}`);
//             return e;
//           }),
//         );
//         return d;
//       }),
//     );
//   }
//   if (cases === queryBuildCases.getQROfSurvey) {
//     data = await Promise.all(
//       parse(data).map(async (e) => {
//         e.survey_url = `${e.survey_url}?trainer_slug=${req?.tokenData?.user?.username}`;
//         e.survey_qr = await qrcode.toDataURL(`${FRONT_URL}/${e.survey_url}`);
//         return e;
//       }),
//     );
//     return data;
//   }
//   if (cases === queryBuildCases.getAllCourseOfTrainer) {
//     if (!_.isUndefined(req?.query?.course_slug)) {
//       data = parse(data).map((courses) => {
//         let totalCourseTime = 0;
//         if (courses.card && courses?.status === CourseStatus.publish) {
//           courses.course_funded_docs = courses?.card?.card_attachments.filter((r) => r?.is_funded_documents);
//           // delete courses?.card;
//         }
//         if (courses.card) {
//           courses.course_attachments = courses?.card?.card_attachments.filter((r) => r?.show_trainer);
//           delete courses?.card;
//         }
//         courses.lessons.map((lesson) => {
//           let totalTime = 0;
//           lesson.lesson_sessions.forEach((session) => {
//             totalTime += calculateTimeDifference(session.start_time, session.end_time);
//           });
//           const hoursDifference = Number(Math.floor(totalTime / 60));

//           const remainingMinutes = +Number(totalTime) % 60;
//           lesson.duration = `${hoursDifference ? +hoursDifference + 'h' : ''} ${remainingMinutes ? +remainingMinutes + 'm' : ''}`;
//           totalCourseTime += totalTime;
//           return lesson;
//         });
//         const hoursDifference = Number(Math.floor(totalCourseTime / 60));

//         const remainingMinutes = totalCourseTime % 60;

//         courses.duration = `${hoursDifference ? +hoursDifference + 'h' : ''} ${remainingMinutes ? +remainingMinutes + 'm' : ''}`;
//         return courses;
//       });
//     }
//   }

//   if (cases === queryBuildCases.getAllLogs) {
//     data = parse(data).map((d) => {
//       if (d?.is_language_considered && d?.language !== req?.language) return null;
//       return d;
//     });
//     data = _.filter(data, (e) => !_.isNull(e));
//   }

//   if (cases === queryBuildCases.getAllQuoteProductLogs) {
//     data = parse(data).map((d) => {
//       if (d?.is_language_considered && d?.language !== req?.language) return null;
//       return d;
//     });
//     data = _.filter(data, (e) => !_.isNull(e));
//   }
//   if (cases === queryBuildCases.getAllQuotes) {
//     if (!_.isUndefined(req.query.company) || !_.isUndefined(req.query.code)) {
//       return data.filter((item) => {
//         let companyIds = [];
//         let codeIds = [];

//         if (!_.isUndefined(req.query.company)) {
//           companyIds = Array.isArray(req.query.company)
//             ? req.query.company.map(Number)
//             : (req.query.company + '').split(',').map(Number);
//         }

//         if (!_.isUndefined(req.query.code)) {
//           codeIds = Array.isArray(req.query.code) ? req.query.code.map(Number) : (req.query.code + '').split(',').map(Number);
//         }
//         const companyMatch = _.isEmpty(companyIds) || companyIds.some((id) => id === item.company_id);
//         const codeMatch = _.isEmpty(codeIds) || item.quoteProduct.some((product) => codeIds.includes(product.code_id));

//         return companyMatch && codeMatch;
//       });
//     }
//     data.forEach((item) => {
//       item.isQuoteAssigned = item.isQuoteAssigned === 1 ? true : false;
//     });
//     // if (req?.query?.search) {
//     //   data = parse(data).filter((d) => !_.isEmpty(d?.company));
//     // }
//     return data;
//   }
//   if (cases === queryBuildCases.getAllManagersDetails) {
//     if (req?.query?.search) {
//       data = parse(data).filter((e) => {
//         if (isStringMatched(req?.query?.search, e?.company?.name)) return e;
//         if (isStringMatched(req?.query?.search, e?.manager?.user?.first_name)) return e;
//         if (isStringMatched(req?.query?.search, e?.manager?.user?.last_name)) return e;
//         if (isStringMatched(req?.query?.search, e?.manager?.user?.email)) return e;
//         if (isStringMatched(req?.query?.search, e?.manager?.user?.contact)) return e;

//         if (isStringMatched(req?.query?.search, `${e?.manager?.user?.first_name} ${e?.manager?.user?.last_name}`)) return e;
//       });
//     }
//     data = groupByManager(data);
//   }
//   if (cases === queryBuildCases.getAllRoleWiseData) {
//     if (req?.query?.is_manager) {
//       data = data?.filter((e) => {
//         return e?.managers?.every((manager) => manager?.company_manager?.length === 0);
//       });
//     }
//     if (req?.query?.search) {
//       data = parse(data).filter((e) => {
//         if (isStringMatched(req?.query?.search, e?.email)) return e;
//         if (isStringMatched(req?.query?.search, e?.contact)) return e;
//         if (isStringMatched(req?.query?.search, `${e?.first_name} ${e?.last_name}`)) return e;
//       });
//     }
//   }

//   if (cases === queryBuildCases.getAllCourse) {
//     if (req?.query?.search) {
//       data = parse(data).filter((e) => {
//         if (isStringMatched(req?.query?.search, e?.title)) return e;
//       });
//     }
//   }

//   if (cases === queryBuildCases.getAllCourseCategory) {
//     if (req?.query?.search) {
//       data = parse(data).filter((e) => {
//         if (isStringMatched(req?.query?.search, e?.name)) return e;
//       });
//     }
//   }

//   if (cases === queryBuildCases.getAllCourseTemplate) {
//     if (req?.query?.search) {
//       data = parse(data).filter((e) => {
//         if (isStringMatched(req?.query?.search, e?.title)) return e;
//         if (isStringMatched(req?.query?.search, e?.code)) return e;
//       });
//     }
//   }

//   if (cases === queryBuildCases.getSurveyForm) {
//     if (req?.query?.search) {
//       data = parse(data).filter((e) => {
//         if (isStringMatched(req?.query?.search, e?.title)) return e;
//       });
//     }
//   }

//   if (cases === queryBuildCases.getProjectsByStages) {
//     if (req?.query?.search) {
//       data = parse(data).map((e) => ({
//         ...e,
//         cards: e.cards.filter((card) => isStringMatched(req?.query?.search, card?.title)),
//       }));
//     }
//   }

//   if (cases === queryBuildCases.getExamResult) {
//     const groupedData = _.groupBy(data, 'exam_participate.id');
//     const resultData = _.map(groupedData, (value) => {
//       const v = Object.values(value);
//       let totalMarks = 0;
//       const submissionResults = v.map((submission) => {
//         const { exam_question, marks, exam_participate } = parse(submission);
//         const options = exam_question.answers.map((option) => option.answer);
//         totalMarks += marks;
//         const correctAnswer = exam_question.answers.find((answer) => answer.is_correct)?.answer;
//         return {
//           question: exam_question.question,
//           correctAnswer: correctAnswer,
//           userAnswer: submission.exam_answer ? submission.exam_answer.answer : null,
//           options,
//           marks: submission.marks,
//           isCorrect: submission.is_correct_ans,
//           exam_participate,
//         };
//       });
//       return {
//         participate: v[0]?.exam_participate?.first_name,
//         total_marks: totalMarks,
//         data: submissionResults,
//       };
//     });
//     data = resultData;
//   }

//   if (cases === queryBuildCases.getExamResultForAllParticipate) {
//     const groupedData = _.groupBy(data, 'exam_participate.id');
//     const resultData = [];

//     // Iterate through each group of data (each participant)
//     _.forEach(groupedData, (value, key) => {
//       const participantId = parseInt(key); // Convert key to integer if necessary
//       const v = Object.values(value);
//       let totalMarks = 0;

//       const submissionResults = v.map((submission) => {
//         const { exam_question, marks, exam_participate } = parse(submission);
//         const options = exam_question.answers.map((option) => option.answer);
//         totalMarks += marks;
//         const correctAnswer = exam_question.answers.find((answer) => answer.is_correct)?.answer;
//         return {
//           question: exam_question.question,
//           correctAnswer: correctAnswer,
//           userAnswer: submission.exam_answer ? submission.exam_answer.answer : null,
//           options,
//           marks: submission.marks,
//           isCorrect: submission.is_correct_ans,
//           exam_participate,
//         };
//       });
//       // Push each participant's result to resultData array
//       resultData.push({
//         participate: value[0]?.exam_participate?.first_name,
//         total_marks: totalMarks,
//         data: submissionResults,
//       });
//     });
//     // Assuming you want to log or further process each participant's data
//     data = resultData;
//   }

//   if (cases === queryBuildCases.getAttendeesResult) {
//     if (parse(req?.tokenData?.user)?.role_name === RoleEnum.CompanyManager) {
//       data = data.filter((d) => {
//         return d.course_participate_id !== null;
//       });
//     }
//   }

//   if (cases === queryBuildCases.getRoomAndResourcesAssignedToTrainers) {
//     const course = parse(data) as Course;

//     const { trainerRoomAndUsers, alreadyAssignedRooms, alreadyAssignedResourceQtyMap } = processTrainerRoomAndResources(
//       course.lessonSessionApproval,
//       course.trainer_assigned_room_resources,
//     );
//     const { optionalRoom, optionalResources, totalOptionalResources } = processAvailableRoomAndResources(
//       course.assigned_rooms,
//       course.course_resources,
//       alreadyAssignedRooms,
//       alreadyAssignedResourceQtyMap,
//     );

//     const allTrainerRoomAndUsers = addOtherTrainers(course.lessonSessionApproval, trainerRoomAndUsers, req);
//     const trainerRoomAndUsersArr = Object.values(allTrainerRoomAndUsers);

//     return {
//       trainerRoomAndUsers: trainerRoomAndUsersArr,
//       optionalRoom,
//       optionalResources,
//       totalOptionalResources,
//       isResourceAvaliableForEachTrainer: totalOptionalResources >= trainerRoomAndUsersArr.length,
//     };
//   }

//   if (cases === queryBuildCases.getCompanyWiseQuotes) {
//     let comapnyWithQuotes = data as Company[];
//     comapnyWithQuotes = comapnyWithQuotes.reduce((acc, company) => {
//       const quotes = company.Quotes.filter((quote) => quote.projectQuotes?.length === 0);
//       if (quotes.length > 0) {
//         company.Quotes = quotes;
//         acc.push(company);
//       }
//       return acc;
//     }, []);

//     return comapnyWithQuotes;
//   }
//   if (cases === queryBuildCases.getSelectedTrainer) {
//     data = await Promise.all(
//       parse(data).map(async (record) => {
//         const [availableDates] = await Promise.all([availableForDatesOrNot(req, record?.id)]);
//         return {
//           name: record?.full_name,
//           email: record?.email,
//           username: record?.username,
//           profile_image: record?.profile_image,
//           id: record?.id,
//           role_name: record?.role?.name,
//           rate: record?.trainer?.trainerSurvey.reduce((acc, val) => acc + val.rate, 0) / record?.trainer?.trainerSurvey.length,
//           selected_status: availableDates?.every((r) => r.status == 'available') ? 'available' : 'unavailable',
//           assigned: true,
//           dates: availableDates,
//         };
//       }),
//     );
//   }
//   if (cases === queryBuildCases.getAllTrainers) {
//     data = parse(data).map((record) => {
//       if (_.isEmpty(record?.assignedLessonSession)) {
//         return {
//           name: record?.full_name,
//           email: record?.email,
//           username: record?.username,
//           profile_image: record?.profile_image,
//           id: record?.id,
//           role_name: record?.role?.name,
//           rate: record?.trainer?.trainerSurvey.reduce((acc, val) => acc + val.rate, 0) / record?.trainer?.trainerSurvey.length,
//           all_status: 'available',
//         };
//       } else return null;
//     });
//     data = data.filter((record) => !_.isNull(record));
//   }
//   if (cases === queryBuildCases.getCoursesOfBundle) {
//     data = parse(data).map((course) => {
//       course.total_participates = course?.course_participates?.length || 0;
//       delete course?.course_participates;
//       return course;
//     });
//   }
//   if (cases === queryBuildCases.getAllOptionalTrainers) {
//     data = parse(data).map((lsa) => {
//       // lsa.name = lsa.assign;
//       return lsa;
//     });
//   }
//   if (cases === queryBuildCases.getCourseBundleRoomAndResourcesAssignedToTrainers) {
//     const courseBundle = parse(data) as CourseBundle & { lesson_session_approval: LessonSessionApproval[] };

//     const { trainerRoomAndUsers, alreadyAssignedRooms, alreadyAssignedResourceQtyMap } = processTrainerRoomAndResources(
//       courseBundle.lesson_session_approval,
//       courseBundle.trainer_assigned_room_resources,
//     );
//     const { optionalRoom, optionalResources, totalOptionalResources } = processAvailableRoomAndResources(
//       courseBundle.assigned_rooms,
//       courseBundle.course_resources,
//       alreadyAssignedRooms,
//       alreadyAssignedResourceQtyMap,
//     );

//     const allTrainerRoomAndUsers = addOtherTrainers(courseBundle.lesson_session_approval, trainerRoomAndUsers, req);
//     const trainerRoomAndUsersArr = Object.values(allTrainerRoomAndUsers);

//     return {
//       trainerRoomAndUsers: trainerRoomAndUsersArr,
//       optionalRoom,
//       optionalResources,
//       totalOptionalResources,
//       isResourceAvaliableForEachTrainer: totalOptionalResources >= trainerRoomAndUsersArr.length,
//     };
//   }

//   if (cases === queryBuildCases.getCourseParticipantDetails) {
//     const courseParticipates = parse(data) as CourseParticipates & { course: { percentage: number } };
//     let courseAttendacePercentage = 0;
//     let sessionCount = 0;

//     const lessions = courseParticipates.course.lessons.map((lesson) => {
//       const sessions = lesson.lesson_sessions.map(
//         (session: LessonSession & { percentage: number; showRecoverSession: boolean }) => {
//           const percentage = calculateAttendance(session, session.courseAttendanceSheet[0], session.courseAttendanceLog);
//           session.percentage = Number(percentage);
//           session.showRecoverSession = new Date() > new Date(courseParticipates?.course?.end_date);
//           courseAttendacePercentage += Number(percentage);
//           sessionCount++;
//           return session;
//         },
//       );

//       lesson.lesson_sessions = sessions;
//       return lesson;
//     });

//     courseParticipates.course.lessons = lessions;
//     courseParticipates.course.percentage = courseAttendacePercentage / sessionCount;
//     return courseParticipates;
//   }

//   if (cases === queryBuildCases.getAttendanceSheetOfParticipate) {
//     const courseParticipates = parse(data) as CourseParticipates[];
//     return getCourseParticipantWithAttendanceCalculation(courseParticipates);
//   }

//   if (cases === queryBuildCases.getAllCourseParticipates) {
//     const courseParticipates = parse(data) as CourseParticipates[];
//     return getCourseParticipantWithAttendanceCalculation(courseParticipates);
//   }
//   if (cases === queryBuildCases.getAllCertificateTemplate) {
//     data = parse(data).map((d) => {
//       d.note = JSON.parse(d.note);
//       return d;
//     });
//   }

//   if (req.query?.simplifyResponseByLanguage) {
//     data = mergeLanguageObjects(data);
//   }

//   if (cases === queryBuildCases.getAllCourseQuotes) {
//     data = parse(data).map((e) => {
//       delete e?.quote;
//       return e;
//     });
//   }

//   if (cases === queryBuildCases.getAllCoursePrivateCompanies) {
//     data = parse(data).map((e) => {
//       delete e?.company;
//       return e;
//     });
//   }
//   if (cases === queryBuildCases.getAllInvoice) {
//     const invoiceData = [];
//     await Promise.all(
//       parse(data).map(async (invoice) => {
//         const groupedData = _.groupBy(
//           invoice?.invoice_product,
//           (item) => `${item.project_id}_${item.order_id}_${item.company_id}_${item.main_id}`,
//         );
//         const consolidatedInvoiceProduct: any[] = [];
//         // Iterate over each group
//         for (const key in groupedData) {
//           if (groupedData.hasOwnProperty(key)) {
//             const groupItems = groupedData[key];
//             let productData: any = [];
//             let invoiceProductData: any = [];

//             if (groupItems[0].main_id) {
//               productData = await QuoteProduct.findOne({ where: { id: groupItems[0].main_id } });
//               invoiceProductData = [
//                 {
//                   ...groupItems[0],
//                   product: { ...parse(productData), units: groupItems.length },
//                 },
//               ];
//             } else {
//               invoiceProductData = groupItems;
//             }
//             consolidatedInvoiceProduct.push(...invoiceProductData);
//           }
//         }
//         invoiceData.push({ ...invoice, invoice_product: consolidatedInvoiceProduct });
//       }),
//     );
//     return invoiceData;
//   }

//   if (cases === queryBuildCases.getAllSupplier) {
//     /// Step 1: Group by 'value'
//     const grouped = _.groupBy(data, 'category');

//     // Step 2: Extract the first record from each group
//     const firstRecords = _.map(grouped, (group) => group[0]);

//     return firstRecords;
//   }

//   if (cases === queryBuildCases.getAllSupplierName) {
//     /// Step 1: Group by 'value'
//     const grouped = _.groupBy(data, 'name');

//     // Step 2: Extract the first record from each group
//     const firstRecords = _.map(grouped, (group) => group[0]);

//     return firstRecords;
//   }

//   if (cases === queryBuildCases.getAllSurveyResult) {
//     const groupedData = _(data)
//       .groupBy('survey_question_id')
//       .map((items, key) => {
//         return {
//           survey_question_id: key,
//           question: items[0].survey_question,
//           total_participate: _.uniq(items.map((item) => item?.exam_participate_id))?.length,
//           answers: items,
//         };
//       })
//       .value();
//     return groupedData;
//   }

//   if (cases === queryBuildCases.getAllTrainerInvoice) {
//     const invoiceData = [];
//     let course_total = 0;
//     await Promise.all(
//       parse(data).map(async (invoice) => {
//         const lumpsum = await CourseLumpSumAmount.findOne({
//           where: {
//             trainer_id: invoice?.trainer_id,
//             course_id: invoice?.course_id,
//           },
//         });

//         if (lumpsum) {
//           const lumpsum_price = {
//             amount: lumpsum.amount,
//             reimbursement_amount: lumpsum.reimbursement_amount,
//             net_total: lumpsum.amount * lumpsum.reimbursement_amount,
//           };
//           invoiceData.push({
//             ...invoice,
//             lumpsum_data: true,
//             lumpsum_price,
//           });
//           course_total = lumpsum_price?.net_total + (invoice?.bonus || 0);
//         } else {
//           if (invoice?.lesson_session?.start_time && invoice?.lesson_session?.end_time) {
//             const start = new Date(invoice?.lesson_session?.start_time);
//             const end = new Date(invoice?.lesson_session?.end_time);

//             // Get the difference in milliseconds
//             const diffInMilliseconds = end.getTime() - start.getTime();

//             // Convert milliseconds to hours
//             const hours = diffInMilliseconds / (1000 * 60 * 60);

//             const price = invoice?.trainer_user?.trainer?.hourly_rate;
//             const total_price = hours * price;
//             const lession_price = {
//               hours,
//               price,
//               total_price,
//             };

//             const days = 1;
//             let kilometer = 0;

//             const origin = invoice?.trainer_user?.trainer?.location;
//             const destination = invoice?.lesson_session?.lesson?.location;
//             const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
//             const distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;
//             kilometer += distanceValue;
//             // const kilometer = 11;
//             const reimbursement_price = invoice?.trainer_user?.trainer?.travel_reimbursement_fee;

//             const reimbursement_total_price = reimbursement_price * kilometer;
//             const travel_reimbursement = {
//               days,
//               kilometer,
//               reimbursement_price,
//               reimbursement_total_price,
//             };
//             const net_total = total_price + reimbursement_total_price;
//             invoiceData.push({
//               ...invoice,
//               lumpsum_data: false,
//               lession_price,
//               travel_reimbursement,
//               net_total,
//             });
//             course_total = course_total + net_total + (invoice?.bonus || 0);
//           }
//         }
//       }),
//     );

//     const groupedByCourse = _.groupBy(invoiceData, (item) => `${item.course_id}`);

//     const mergedData = [];

//     for (const key in groupedByCourse) {
//       if (groupedByCourse.hasOwnProperty(key)) {
//         // Access the array of objects for the current company_id_payment_due combination
//         const courseData = groupedByCourse[key];

//         courseData.map((course) => {});

//         mergedData.push({
//           trainer: courseData[0]?.trainer_user,
//           trainerCourse: courseData[0]?.trainer_course,
//           courseData,
//           course_total,
//         });
//       }
//     }

//     return mergedData;
//   }

//   return data;
// };

// export function calculateTimeDifference(start, end) {
//   const startTime = parseISO(start);
//   const endTime = parseISO(end);
//   return Number(differenceInMinutes(endTime, startTime));
// }

// function processTrainerRoomAndResources(
//   lessonSessionApproval: LessonSessionApproval[],
//   trainerAssignedRoomResources: TrainerAssignedRoomResources[],
// ) {
//   const trainerRoomAndUsers: {
//     [key: string]: {
//       assignedTo: User;
//       room: { id: number; title: string };
//       resources: { id: number; title: string; usedQty: number }[];
//     };
//   } = {};
//   const alreadyAssignedRooms: number[] = [];
//   const alreadyAssignedResourceQtyMap: { [key: number]: { qty: number } } = {};

//   lessonSessionApproval.forEach((lsa: LessonSessionApproval & { assignedToUser: User }) => {
//     const assignedRoom = { id: null, title: '' };
//     const assignedResources = [];

//     lsa.trainerAssignedRoomResources.forEach((tarr) => {
//       if (tarr.course_room_id) {
//         assignedRoom.id = tarr.courseRoom.id;
//         assignedRoom.title = tarr.courseRoom.title;
//       }

//       if (tarr.resource_id) {
//         assignedResources.push({
//           id: tarr.resource.id,
//           title: tarr.resource.title,
//           usedQty: tarr.quantity,
//         });
//       }

//       trainerRoomAndUsers[lsa.assignedToUser?.id] = {
//         assignedTo: lsa.assignedToUser,
//         room: assignedRoom,
//         resources: assignedResources,
//       };
//     });
//   });

//   trainerAssignedRoomResources.forEach((tarr) => {
//     if (tarr.course_room_id) {
//       alreadyAssignedRooms.push(tarr.course_room_id);
//     }

//     if (tarr.resource_id) {
//       alreadyAssignedResourceQtyMap[tarr.resource_id] = {
//         qty: tarr.quantity + (alreadyAssignedResourceQtyMap[tarr.resource_id]?.qty || 0),
//       };
//     }
//   });

//   return { trainerRoomAndUsers, alreadyAssignedRooms, alreadyAssignedResourceQtyMap };
// }

// function processAvailableRoomAndResources(
//   assignedRooms: AssignedRooms[],
//   courseResources: CourseResources[],
//   alreadyAssignedRooms: number[],
//   alreadyAssignedResourceQtyMap: {
//     [key: number]: {
//       qty: number;
//     };
//   },
// ) {
//   const optionalRoom: { id: number; title: string }[] = [];
//   const optionalResources: { id: number; title: string; totalQty: number; usedQty: number }[] = [];
//   let totalOptionalResources = 0;

//   assignedRooms.forEach((_assignedRoom) => {
//     if (!alreadyAssignedRooms.includes(_assignedRoom.room_id) && _assignedRoom.is_optional) {
//       optionalRoom.push({ id: _assignedRoom.course_room.id, title: _assignedRoom.course_room.title });
//     }
//   });

//   courseResources.forEach((courseResource) => {
//     const resource = alreadyAssignedResourceQtyMap[courseResource.resource_id];

//     if (courseResource.is_optional) {
//       totalOptionalResources += courseResource.quantity;
//       optionalResources.push({
//         id: courseResource.resources.id,
//         title: courseResource.resources.title,
//         totalQty: courseResource.quantity,
//         usedQty: resource?.qty || 0,
//       });
//     }
//   });

//   return { optionalRoom, optionalResources, totalOptionalResources };
// }

// function addOtherTrainers(
//   lessonSessionApproval: LessonSessionApproval[],
//   trainerRoomAndUsers: {
//     [key: string]: {
//       assignedTo: User;
//       room: { id: number; title: string };
//       resources: { id: number; title: string; usedQty: number }[];
//     };
//   },
//   req: Request,
// ) {
//   const updatedTrainerRoomAndUsers: {
//     [key: string]: {
//       assignedTo: User;
//       room: { id: number; title: string };
//       resources: { id: number; title: string; usedQty: number }[];
//     };
//   } = {
//     ...trainerRoomAndUsers,
//   };

//   lessonSessionApproval.forEach((lsa: LessonSessionApproval & { assignedToUser: User }) => {
//     if (
//       !updatedTrainerRoomAndUsers[lsa.assignedToUser?.id] &&
//       (lsa.assigned_to_status === AssignedStatus.Accepted || lsa.assignedToUser?.id === Number(req.query?.trainer_id))
//     ) {
//       updatedTrainerRoomAndUsers[lsa.assignedToUser?.id] = {
//         assignedTo: lsa.assignedToUser,
//         room: null,
//         resources: [],
//       };
//     }
//   });

//   return updatedTrainerRoomAndUsers;
// }

// function setCourseData(data) {
//   data.courses = data?.courses?.map((course) => {
//     course.lessonApproval = [];
//     course.main_trainers = [];
//     course.optional_trainers = [];
//     course.total_participates = course?.course_participates?.length || 0;
//     course.lessonSessionApproval.forEach((lessonSessionData) => {
//       lessonSessionData.room = lessonSessionData?.trainerAssignedRoomResources.find(
//         (tarr) => tarr.course_room_id,
//       )?.courseRoom?.title;
//       lessonSessionData.resources = lessonSessionData?.trainerAssignedRoomResources
//         .filter((tarr) => tarr.course_resource_id)
//         .map((tarr) => tarr?.resource?.title || '');
//       if (lessonSessionData.is_full_course && _.isNull(lessonSessionData.lesson_session_id)) {
//         if (lessonSessionData.is_optional) {
//           course.optional_trainers.push({
//             assigned_to_status: lessonSessionData?.assigned_to_status,
//             assignedToUser: lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//             id: lessonSessionData?.assignedToUser?.id,
//             profile_image: lessonSessionData?.assignedToUser?.profile_image,
//             is_full_course: lessonSessionData.is_full_course,
//             is_optional: lessonSessionData.is_optional,
//             room: lessonSessionData?.room,
//             resources: lessonSessionData.resources.join(','),
//           });
//         } else {
//           course.main_trainers.push({
//             assigned_to_status: lessonSessionData?.assigned_to_status,
//             assignedToUser: lessonSessionData?.assignedToUser?.first_name + ' ' + lessonSessionData?.assignedToUser?.last_name,
//             id: lessonSessionData?.assignedToUser?.id,
//             profile_image: lessonSessionData?.assignedToUser?.profile_image,
//             is_full_course: lessonSessionData.is_full_course,
//             is_optional: lessonSessionData.is_optional,
//             room: lessonSessionData.room,
//             resources: lessonSessionData.resources.join(','),
//           });
//         }
//       }
//     });

//     delete course.lessonSessionApproval;

//     course.lessonApproval = [...course.main_trainers, ...course.optional_trainers];
//     course.lessonApproval = _.uniqBy(course.lessonApproval, 'assignedToUser');

//     return course;
//   });
//   return data;
// }
// function calculateAttendance(
//   session: LessonSession,
//   courseAttendanceSheet: CourseAttendanceSheet,
//   courseAttendanceLog: CourseAttendanceLog[],
// ) {
//   const attendance = courseAttendanceSheet;
//   if (!attendance.mark_as_start_signed_at || !attendance.mark_as_end_signed_at) {
//     return 0;
//   }

//   const startGapDuration = new Date(attendance.mark_as_start_signed_at).getTime() - new Date(session.start_time).getTime();
//   const endGapDuration = new Date(session.end_time).getTime() - new Date(attendance.mark_as_end_signed_at).getTime();

//   const totalSessionDuration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();

//   let timeAttended = totalSessionDuration;
//   for (const breakTime of courseAttendanceLog) {
//     timeAttended -= new Date(breakTime.break_out).getTime() - new Date(breakTime.break_in).getTime();
//   }

//   timeAttended -= startGapDuration - endGapDuration;

//   return ((timeAttended * 100) / totalSessionDuration).toFixed(2);
// }

// function getCourseParticipantWithAttendanceCalculation(courseParticipates: CourseParticipates[]) {
//   return courseParticipates.map(
//     (courseParticipate: CourseParticipates & { courseAttendance: number; totalCourseHours: number; attendedHours: string }) => {
//       // let courseAttendacePercentage = 0;
//       // let sessionCount = 0;
//       let totalCourseHours = 0;
//       let attendedHours = 0;

//       const attendanceSheet = courseParticipate.courseAttendanceSheet
//         .filter((asheet) => asheet.lessonSession)
//         .map(
//           (
//             courseAttendanceSheet: CourseAttendanceSheet & {
//               lessonSession: { sessionAttendance: number; showRecoverSession: boolean };
//             },
//           ) => {
//             totalCourseHours += calculateHours(
//               courseAttendanceSheet.lessonSession.start_time,
//               courseAttendanceSheet.lessonSession.end_time,
//             );

//             if (courseAttendanceSheet.mark_as_start_signed_at && courseAttendanceSheet.mark_as_end_signed_at) {
//               attendedHours += calculateHours(
//                 courseAttendanceSheet.mark_as_start_signed_at,
//                 courseAttendanceSheet.mark_as_end_signed_at,
//               );
//               const percentage = calculateAttendance(
//                 courseAttendanceSheet.lessonSession,
//                 courseAttendanceSheet,
//                 courseAttendanceSheet.lessonSession.courseAttendanceLog,
//               );
//               courseAttendanceSheet.lessonSession.sessionAttendance = Number(percentage);
//               courseAttendanceSheet.lessonSession.showRecoverSession =
//                 new Date() > new Date(courseAttendanceSheet.lessonSession.course.end_date) && Number(percentage) < 90;
//             }

//             // courseAttendacePercentage += percentage;
//             // sessionCount++;
//             return courseAttendanceSheet;
//           },
//         );

//       courseParticipate.courseAttendanceSheet = attendanceSheet;
//       // courseParticipate.courseAttendance = courseAttendacePercentage / sessionCount;
//       courseParticipate.courseAttendance = Number(((attendedHours * 100) / totalCourseHours).toFixed(2));
//       courseParticipate.totalCourseHours = totalCourseHours;
//       courseParticipate.attendedHours = attendedHours.toFixed(2);
//       courseParticipate.is_recovered = isObject(courseParticipate.is_recovered) as unknown as any;
//       return courseParticipate;
//     },
//   );
// }
// function isStringMatched(searchStr, recordStr) {
//   // Escape special characters in the search string
//   const escapedSearchStr = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   // Create a regular expression pattern with the search string matching anywhere in the record string
//   const regex = new RegExp('.*' + escapedSearchStr + '.*', 'i');
//   // Test if the record string matches the regular expression
//   const result = regex.test(recordStr);
//   return result;
// }

// function groupByManager(input) {
//   const data = input.reduce((acc, entry) => {
//     const manager = entry.manager;
//     const company = entry.company;

//     // Check if the manager already exists in the accumulator
//     if (acc.find((e) => e?.id === manager?.id)) {
//       // If not, initialize an array to hold companies for this manager
//       const i = acc.findIndex((e) => e?.id === manager?.id);
//       const c = acc[i].companies.findIndex((e) => e === company);
//       if (c === -1) acc[i].companies.push(company);
//     } else {
//       // If yes, push the company to the existing array
//       acc.push({ ...manager, company: { name: company.name }, companies: [company] });
//     }

//     return acc;
//   }, []);

//   return data;
// }

// export async function availableForDatesOrNot(req: Request, assigned_to: number) {
//   const availableDates = [];
//   if (req?.query?.dates) {
//     const dates = String(req?.query?.dates).split(',');
//     if (dates) {
//       for (const date of dates) {
//         const lessonApprovalData = await LessonSessionApproval.findAll({
//           where: {
//             course_id: { [Op.notIn]: req?.query?.courseIds as unknown as number[] },
//             available: true,
//             assigned_to_status: {
//               [Op.in]: [AssignedStatus.Accepted, AssignedStatus.Requested],
//             },
//             assigned_to,
//           },

//           attributes: ['id'],
//           include: [
//             {
//               model: Lesson,
//               where: {
//                 date: date,
//               },
//               attributes: [],
//             },
//             {
//               model: Course,
//               where: {
//                 deleted_at: null,
//               },
//               attributes: [],
//               required: true,
//             },
//           ],
//         });
//         const dataToPush = {
//           date: date,
//           status: 'available',
//           lessonApprovalData: parse(lessonApprovalData),
//         };

//         if (!_.isEmpty(lessonApprovalData)) dataToPush.status = 'unavailable';
//         availableDates.push(dataToPush);
//       }
//     }
//   }
//   return availableDates;
// }

// function calculateTotalDurationAndConflicts(lessonSessions) {
//   // Object to store filtered day-wise slots
//   const filteredSlots = {};

//   // Helper function to convert ISO date string to Date object
//   function getDateObject(dateStr) {
//     return parseISO(dateStr);
//   }

//   // Helper function to calculate duration in milliseconds between two dates
//   function calculateDuration(start, end) {
//     return Math.abs(end - start);
//   }

//   // Iterate through each lesson session
//   lessonSessions.forEach((session) => {
//     if (
//       [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//         (session as LessonSessionApproval).trainer_assigned_to_status,
//       ) &&
//       [AssignedStatus.Requested, AssignedStatus.Draft, AssignedStatus.Accepted].includes(
//         (session as LessonSessionApproval).assigned_to_status,
//       ) &&
//       (session as LessonSessionApproval)?.available &&
//       !_.isNull(session.lessonSessions)
//     ) {
//       const start = getDateObject(session.lessonSessions.start_time);
//       const end = getDateObject(session.lessonSessions.end_time);
//       const sessionDate = start.toISOString().substr(0, 10); // Get date in YYYY-MM-DD format

//       // Initialize day-wise filtered slots if not exists
//       if (!filteredSlots[sessionDate]) {
//         filteredSlots[sessionDate] = [];
//       }

//       // Add the current session to the day's slots
//       filteredSlots[sessionDate].push({
//         id: session.id,
//         start_time: start,
//         end_time: end,
//       });
//     }
//   });

//   // Process each day's slots
//   Object.keys(filteredSlots).forEach((date) => {
//     const slots = filteredSlots[date];

//     // Sort slots by start time
//     slots.sort((a, b) => a.start_time - b.start_time);

//     // Array to store non-overlapping slots for the day
//     const nonOverlappingSlots = [];

//     // Iterate through sorted slots and find non-overlapping slots
//     for (let i = 0; i < slots.length; i++) {
//       let currentSlot = slots[i];

//       // If nonOverlappingSlots is empty, add the current slot
//       if (nonOverlappingSlots.length === 0) {
//         nonOverlappingSlots.push(currentSlot);
//       } else {
//         let lastAddedSlot = nonOverlappingSlots[nonOverlappingSlots.length - 1];

//         // Check for overlap with the last added slot
//         if (currentSlot.start_time >= lastAddedSlot.end_time) {
//           // No overlap, add the current slot
//           nonOverlappingSlots.push(currentSlot);
//         } else {
//           // There is an overlap, merge or ignore based on end time
//           if (currentSlot.end_time > lastAddedSlot.end_time) {
//             // Extend the end time of the last added slot
//             lastAddedSlot.end_time = currentSlot.end_time;
//           }
//           // else: Ignore the current slot, as it is fully overlapped by the last added slot
//         }
//       }
//     }

//     // Update filteredSlots with non-overlapping slots for the day
//     filteredSlots[date] = nonOverlappingSlots;
//   });

//   // Calculate total hours for filtered slots
//   let totalHours = 0;
//   Object.keys(filteredSlots).forEach((date) => {
//     filteredSlots[date].forEach((slot) => {
//       totalHours += calculateDuration(slot.start_time, slot.end_time) / (1000 * 60 * 60); // Convert duration from milliseconds to hours
//     });
//   });

//   return { totalHours, filteredSlots };
// }
