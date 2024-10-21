// import { queryBuildCases } from '@/common/constants/enum.constants';
// import { LanguageEnumCMS } from '@/common/interfaces/general/general.interface';
// import { Request } from 'express';
// import sequelize, { Sequelize } from 'sequelize';

// export const attributeSetter = async (req: Request, modelName: string, cases: string, queryBuild: any) => {
//   const { tokenData } = req;
//   const userId = tokenData?.user?.id;

//   if (cases === queryBuildCases.default) {
//     queryBuild.attributes = [...(queryBuild.attributes ? queryBuild.attributes : [])];
//   }
//   if (cases === queryBuildCases.getCourseTrainerDetails) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [sequelize.literal('(CASE WHEN courses.code IS NOT NULL THEN true ELSE false END)'), 'isQuoteAssigned'],
//     ];
//   }
//   if (cases === queryBuildCases.getAllCodes) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [Sequelize.fn('IF', sequelize.col('courses.code_id'), true, false), 'isCodeAssigned'],
//       [Sequelize.col('courses.title'), 'course_title'],
//       [Sequelize.col('courses.slug'), 'course_slug'],
//       [Sequelize.col('courses.price'), 'course_price'],
//       [Sequelize.col('courses.language'), 'course_language'],
//     ];
//   }

//   if (cases === queryBuildCases.getCourseTrainerDetails) {
//     queryBuild.attributes = [...(queryBuild.attributes ? queryBuild.attributes : [])];
//   }

//   if (cases == queryBuildCases.getAllOptionalTrainers) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [
//         Sequelize.fn('concat', Sequelize.col('assignedToUser.first_name'), ' ', Sequelize.col('assignedToUser.last_name')),
//         'name',
//       ],
//     ];
//   }
//   if (cases == queryBuildCases.getAllCertificateTemplate) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [
//         sequelize.literal(
//           `(SELECT IF(version,version,1) FROM certificate_templates where certificate_template_id=${`CertificateTemplate`}.${`id`} ORDER by id DESC LIMIT 1)`,
//         ),
//         'latest_version',
//       ],
//     ];
//   }
//   if (cases == queryBuildCases.getTrainerLossDashboard) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [
//         sequelize.literal(
//           `(select  SUM(TIMESTAMPDIFF(HOUR, start_time, end_time)) AS difference from lesson_sessions ls where course_id=courses.id)`,
//         ),
//         'hours',
//       ],
//     ];
//   }

//   if (cases === queryBuildCases.getAllCourseParticipates) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [Sequelize.literal('CONCAT(CourseParticipates.first_name, " ", CourseParticipates.last_name)'), 'full_name'],
//       [Sequelize.literal(`DATE_ADD(course.start_date, INTERVAL course.validity YEAR)`), 'expiry_date'],
//     ];
//   }

//   if (cases === queryBuildCases.getAllCourseUsedBundleData) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [
//         sequelize.literal(
//           ` (select count(*) as participate_count from courses as c inner join course_participates cp on c.id=cp.course_id  where course_bundle_id=${`CourseBundle`}.${`id`} and cp.language='${
//             req.language
//           }')`,
//         ),
//         'total_participate',
//       ],
//     ];
//   }

//   if (cases === queryBuildCases.getAllCompanyOfCourse) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [Sequelize.col('company.name'), 'company_name'],
//       [Sequelize.col('company.slug'), 'company_slug'],
//       [Sequelize.col('company.logo'), 'company_logo'],
//       [Sequelize.fn('concat', Sequelize.col('manager.first_name'), ' ', Sequelize.col('manager.last_name')), 'manager_name'],
//       [Sequelize.col('manager.email'), 'manager_email'],
//       [Sequelize.col('manager.username'), 'manager_username'],
//       [
//         sequelize.literal(
//           `(SELECT count(*) from course_participates c inner join courses cs on c.course_id=cs.id where c.company_id=company.id and cs.slug='${String(req?.query?.course_slug)}' and c.language='${req?.language}') `,
//         ),
//         'course_participate_count',
//       ],
//       [
//         sequelize.literal(
//           `(SELECT count(DISTINCT(cas.course_participate_id))  from course_participates c inner join courses cs on c.course_id=cs.id  left join ${`course_attendance_sheet`} cas on cas.course_participate_id=c.id where c.company_id=company.id and cs.slug='${String(req?.query?.course_slug)}' and cas.mark_as_end_signed=true and cas.mark_as_end_signed=true and c.language='${req?.language}'  LIMIT 1) `,
//         ),
//         'signed_participate_count',
//       ],
//     ];
//   }
//   if (cases === queryBuildCases.getAttendanceSheetOfParticipate) {
//     queryBuild.attributes = [...(queryBuild.attributes ? queryBuild.attributes : [])];
//   }
//   if (cases === queryBuildCases.getTrainerTodaySession) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [sequelize.literal(` (SELECT COUNT(*) FROM lessons WHERE lessons.course_id = Course.id)`), 'total_lessons'],
//     ];
//   }

//   if (cases === queryBuildCases.getCMSContentPages) {
//     if ((req?.language as unknown as LanguageEnumCMS) == LanguageEnumCMS.italian) {
//       queryBuild.attributes = [
//         ...(queryBuild.attributes ? queryBuild.attributes : []),
//         [Sequelize.col('page_title_it'), 'page_title'],
//       ];
//     }
//     //  else if ((req?.language as unknown as LanguageEnumCMS) == LanguageEnumCMS.German) {
//     //   queryBuild.attributes = [
//     //     ...(queryBuild.attributes ? queryBuild.attributes : []),
//     //     [Sequelize.col('page_title_de'), 'page_title'],
//     //   ];
//     // }
//     else {
//       queryBuild.attributes = [
//         ...(queryBuild.attributes ? queryBuild.attributes : []),
//         [Sequelize.col('page_title'), 'page_title'],
//       ];
//     }
//   }
//   if (cases === queryBuildCases.getAllCourse) {
//     if (!req?.query?.filterView) {
//       queryBuild.attributes = [
//         ...(queryBuild.attributes ? queryBuild.attributes : []),
//         [Sequelize.col('createdByUser.role.name'), 'creator_role'],
//         [Sequelize.col('createdByUser.first_name'), 'creator_first_name'],
//         [Sequelize.col('createdByUser.last_name'), 'creator_last_name'],
//         [
//           Sequelize.fn('concat', Sequelize.col('createdByUser.first_name'), ' ', Sequelize.col('createdByUser.last_name')),
//           'training_specialist',
//         ],
//       ];
//     }
//   }

//   if (cases === queryBuildCases.getAllCourseManager) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),

//       [Sequelize.col('courseSubCategory.name'), 'sub_category_name'],
//       [Sequelize.col('courseSubCategory.id'), 'sub_category_id'],
//       [Sequelize.col('courseSubCategory.slug'), 'sub_category_slug'],
//     ];
//   }
//   if (cases === queryBuildCases.getRoomInfo) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [
//         sequelize.literal(
//           `(SELECT count(*) AS count FROM message_action AS MessageAction WHERE (MessageAction.deleted_at IS NULL AND (MessageAction.room_id = userRoom.id AND MessageAction.user_id = ${userId} AND MessageAction.is_read = false AND MessageAction.is_deleted = false)))`,
//         ),
//         'unreadMessageCount',
//       ],
//       [
//         sequelize.literal(
//           '(SELECT text as lastMessage FROM messages where room_id=`userRoom`.`id` and deleted_at IS NULL order by id desc LIMIT 1)',
//         ),
//         'lastMessage',
//       ],
//       [
//         sequelize.literal(
//           '(SELECT u.username as lastMessageSentBy FROM messages as m inner join users as u on m.sender_id=u.id where room_id=`userRoom`.`id` and m.deleted_at IS NULL order by m.id DESC LIMIT 1)',
//         ),
//         'lastMessageSentBy',
//       ],
//       [
//         sequelize.literal(
//           `(SELECT u.id as lastMsgById FROM messages as m inner join users as u on m.sender_id=u.id where room_id=userRoom.id and m.deleted_at IS NULL order by m.id DESC LIMIT 1)`,
//         ),
//         'lastMsgById',
//       ],
//       [
//         sequelize.literal(
//           `(SELECT m.created_at as lastMessageTime FROM messages as m inner join users as u on m.sender_id=u.id where room_id=userRoom.id and m.deleted_at IS NULL order by m.id DESC LIMIT 1)`,
//         ),
//         'lastMessageTime',
//       ],
//       [
//         sequelize.literal(
//           `(SELECT m.media_type as attachmentType FROM messages as m inner join users as u on m.sender_id=u.id where room_id=userRoom.id and m.deleted_at is null order by m.id DESC LIMIT 1)`,
//         ),
//         'attachmentType',
//       ],
//       [
//         sequelize.literal(`(
//                   SELECT CONCAT(
//                     'public/chat_message_image/',
//                     (SELECT m.media FROM messages AS m
//                      INNER JOIN users AS u ON m.sender_id = u.id
//                      WHERE room_id = userRoom.id and m.deleted_at is null
//                      ORDER BY m.id DESC LIMIT 1)

//                   ) AS attachment
//                 )`),
//         'attachment',
//       ],
//     ];
//   }

//   if (cases === queryBuildCases.getAllQuotes) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [sequelize.fn('IF', sequelize.col('project_id'), true, false), 'isQuoteAssigned'],
//     ];
//   }
//   if (cases === queryBuildCases.getAllCourseManagerEnrolledCourses) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [sequelize.literal(`DATE_ADD(start_date, INTERVAL validity YEAR)`), 'expiry_date'],
//     ];
//   }
//   if (cases === queryBuildCases.getAllCourseParticipates) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [sequelize.literal(`DATE_ADD(course.start_date, INTERVAL course.validity YEAR)`), 'expiry_date'],
//       [
//         sequelize.literal(
//           `(SELECT count(*) from course_participates c inner join courses cs on c.course_id=cs.id where c.company_id=company.id and cs.slug='${String(req?.query?.course_slug)}' and c.language='${req?.language}') `,
//         ),
//         'course_participate_count',
//       ],
//       [
//         sequelize.literal(
//           `(SELECT count(DISTINCT(cas.course_participate_id))  from course_participates c inner join courses cs on c.course_id=cs.id  left join ${`course_attendance_sheet`} cas on cas.course_participate_id=c.id where c.company_id=company.id and cs.slug='${String(req?.query?.course_slug)}' and cas.mark_as_end_signed=true and cas.mark_as_end_signed=true and c.language='${req?.language}'  LIMIT 1) `,
//         ),
//         'signed_participate_count',
//       ],
//     ];
//   }

//   if (cases === queryBuildCases.getAllCourseQuotes) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [Sequelize.col('quote.quote_number'), 'quote_number'],
//       [Sequelize.col('quote.destination_email'), 'destination_email'],
//       [Sequelize.col('quote.status'), 'status'],
//       [Sequelize.col('quote.date'), 'date'],
//       [Sequelize.col('quote.slug'), 'slug'],
//     ];
//   }

//   if (cases === queryBuildCases.getAllCoursePrivateCompanies) {
//     queryBuild.attributes = [
//       ...(queryBuild.attributes ? queryBuild.attributes : []),
//       [Sequelize.col('company.name'), 'name'],
//       [Sequelize.col('company.slug'), 'slug'],
//       [Sequelize.col('company.registration_number'), 'registration_number'],
//     ];
//   }
// };
