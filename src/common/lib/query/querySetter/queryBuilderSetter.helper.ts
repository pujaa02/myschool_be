// import { queryBuildCases } from '@/common/constants/enum.constants';
// import { Request } from 'express';
// import { Op, Sequelize } from 'sequelize';
// import { ParsedQuery } from '../queryParser/query.parser.interface';

// export const queryBuilderSetter = (req: Request, queryBuild: ParsedQuery, cases: string) => {
//   if (cases === queryBuildCases.getCourseByStages && queryBuild?.include?.[0]) {
//     queryBuild.include[0].where = Sequelize.literal(
//       '(Stage.order in (5,7) AND cards.course_type IN ("private", "academy")) OR (cards.course_type != "academy")',
//     );

//     if (req.query?.course_type === 'academy') {
//       queryBuild.include[0].where = Sequelize.literal('(Stage.order  in (5,7) AND cards.course_type IN ("academy"))');
//     }

//     if (req.query?.course_type === 'private') {
//       queryBuild.include[0].where = Sequelize.literal(
//         '(Stage.order = 6 AND cards.course_type IN ("private")) OR (cards.course_type = "private")',
//       );
//     }
//   }
//   if (cases === queryBuildCases.getAllQuotes && queryBuild?.include?.[0]) {
//     if (req?.query?.search && queryBuild?.where[Op.or]) {
//       queryBuild?.where[Op.or]?.push({
//         '$company.name$': {
//           [Op.like]: `%${req.query.search}%`,
//         },
//       });
//     }
//   }

//   if (cases === queryBuildCases.getAllRoleWiseData) {
//     if (req?.query?.search && queryBuild?.where[Op.or]) {
//       queryBuild?.where[Op.or]?.push(
//         Sequelize.where(Sequelize.fn('concat', Sequelize.col('User.first_name'), ' ', Sequelize.col('User.last_name')), {
//           [Op.like]: `%${req.query.search}%`,
//         }),
//       );
//     }
//   }

//   if (cases === queryBuildCases.getAllTrainer) {
//     if (req?.query?.search && queryBuild?.where[Op.or]) {
//       queryBuild?.where[Op.or]?.push(
//         Sequelize.where(Sequelize.fn('concat', Sequelize.col('User.first_name'), ' ', Sequelize.col('User.last_name')), {
//           [Op.like]: `%${req.query.search}%`,
//         }),
//       );
//     }
//   }

//   if (cases === queryBuildCases.getAllPrivateIndividualDetails) {
//     if (req?.query?.search && queryBuild?.where[Op.or]) {
//       queryBuild?.where[Op.or]?.push(
//         Sequelize.where(Sequelize.fn('concat', Sequelize.col('User.first_name'), ' ', Sequelize.col('User.last_name')), {
//           [Op.like]: `%${req.query.search}%`,
//         }),
//       );
//     }
//   }
//   if (cases === queryBuildCases.getAllChatUsers) {
//     if (req?.query?.search && queryBuild?.where[Op.or]) {
//       queryBuild?.where[Op.or]?.push(
//         Sequelize.where(Sequelize.fn('concat', Sequelize.col('User.first_name'), ' ', Sequelize.col('User.last_name')), {
//           [Op.like]: `%${req.query.search}%`,
//         }),
//       );
//     }
//   }

//   if (cases === queryBuildCases.getAllCourseParticipates) {
//     if (req?.query?.search && queryBuild?.where[Op.or]) {
//       queryBuild?.where[Op.or]?.push(
//         Sequelize.where(
//           Sequelize.fn(
//             'concat',
//             Sequelize.col('CourseParticipates.first_name'),
//             ' ',
//             Sequelize.col('CourseParticipates.last_name'),
//           ),
//           {
//             [Op.like]: `%${req.query.search}%`,
//           },
//         ),
//       );
//     }
//   }

//   return queryBuild;
// };
