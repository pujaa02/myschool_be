// import { queryBuildCases } from '@/common/constants/enum.constants';
// import Attachment from '@/sequelizeDir/models/emailAttachment.model';
// import Exam from '@/sequelizeDir/models/exam.model';
// import QuoteAttachments from '@/sequelizeDir/models/quoteAttachment.model';
// import QuoteProduct from '@/sequelizeDir/models/quoteProduct.model';
// import { Request } from 'express';

// export const includeDataSetter = async (req: Request, queryBuild: any, cases: string) => {
//   if (cases === queryBuildCases.default) {
//     // put all the query builder include data
//     queryBuild.include = [...queryBuild.include];
//   }
//   if (cases === queryBuildCases.getAllEmailTemplate) {
//     queryBuild.include = [
//       ...queryBuild.include,
//       {
//         model: Attachment,
//       },
//     ];
//   }
//   if (cases === queryBuildCases.getAllSentMail) {
//     queryBuild.include = [
//       ...queryBuild.include,
//       {
//         model: Attachment,
//       },
//     ];
//   }
//   if (cases === queryBuildCases.getAllQuotes) {
//     if (req.query.isPdf) {
//       queryBuild.include = [
//         ...queryBuild.include,
//         {
//           model: QuoteProduct,
//         },
//       ];
//     }
//     // queryBuild.include = [
//     //   ...queryBuild.include,
//     //   {
//     //     model: Company,
//     //   },
//     // ];
//     queryBuild.include = [
//       ...queryBuild.include,
//       {
//         model: QuoteAttachments,
//       },
//     ];
//   }
//   if (cases === queryBuildCases.getAttendeesResult) {
//     queryBuild.include = [
//       ...queryBuild.include,
//       {
//         model: Exam,
//       },
//     ];
//   }

//   return queryBuild;
// };
