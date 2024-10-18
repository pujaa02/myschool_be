import { queryBuildCases } from '@/common/constants/enum.constants';
import { Request } from 'express';
import _ from 'lodash';

export const orderSetter = async (req: Request, modelName: string, cases: string, queryBuild: any) => {
  if (cases === queryBuildCases.default) queryBuild.order = [['id', 'DESC']];
  if (cases === queryBuildCases.getAllCourseOfTrainer) queryBuild.order = [['updated_at', 'DESC']];
  if (cases === queryBuildCases.getAllCertificateTemplate && req?.query?.latest) queryBuild.order = [['id', 'DESC']];
  if (cases === queryBuildCases.getAllCourseParticipates && _.isUndefined(req?.query?.sort))
    queryBuild.order = [['courseParticipateExam', 'updated_at', 'DESC']];
  if (cases === queryBuildCases.getAllCourseParticipates && !_.isUndefined(req?.query?.sort)) {
    if (req?.query?.sort === '-company_name') queryBuild.order = [['company', 'name', 'DESC']];
    if (req?.query?.sort === 'company_name') queryBuild.order = [['company', 'name', 'ASC']];
    if (req?.query?.sort === '-course_title') queryBuild.order = [['course', 'title', 'DESC']];
    if (req?.query?.sort === 'course_title') queryBuild.order = [['course', 'title', 'ASC']];
    if (req?.query?.sort === '-course_category') queryBuild.order = [['course', 'courseCategory', 'name', 'DESC']];
    if (req?.query?.sort === 'course_category') queryBuild.order = [['course', 'courseCategory', 'name', 'ASC']];
  }

  if (cases === queryBuildCases.getAllQuotes && req?.query?.slug)
    queryBuild.order = [['quoteProduct', 'product_sequence', 'ASC']];
  if (cases === queryBuildCases.getAllQuotes) queryBuild.order = [['id', 'DESC']];
  return queryBuild;
};
