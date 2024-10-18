import { RoleEnum, queryBuildCases } from '@/common/constants/enum.constants';
import { parse } from '@/common/utils';
import Card from '@/sequelizeDir/models/card.model';
import CardActivity from '@/sequelizeDir/models/cardActivity.model';
import CardAttachment from '@/sequelizeDir/models/cardAttachment.model';
import CardCompany from '@/sequelizeDir/models/cardCompany.model';
import CardLabel from '@/sequelizeDir/models/cardLabel.model';
import CardMember from '@/sequelizeDir/models/cardMember.model';
import Company from '@/sequelizeDir/models/company.model';
import Course from '@/sequelizeDir/models/course.model';
import CourseParticipates from '@/sequelizeDir/models/courseParticipates.model';
import Label from '@/sequelizeDir/models/label.model';
import Lesson from '@/sequelizeDir/models/lesson.model';
import LessonSession from '@/sequelizeDir/models/lessonSession.model';
import LessonSessionApproval from '@/sequelizeDir/models/lessonSessionApproval.model';
import Project from '@/sequelizeDir/models/project.model';
import ProjectNotes from '@/sequelizeDir/models/projectNotes.model';
import ProjectQuote from '@/sequelizeDir/models/projectQuote.model';
import Quotes from '@/sequelizeDir/models/quote.model';
import QuoteProduct from '@/sequelizeDir/models/quoteProduct.model';
import Trainer from '@/sequelizeDir/models/trainer.model';
import User from '@/sequelizeDir/models/user.model';
import { Request } from 'express';

export const caseHandlers = {
  [queryBuildCases.getProjectsCardDetails]: handleProjectsCardDetails,
  [queryBuildCases.getCourseCardDetails]: handleCourseCardDetails,
  default: handleDefault,
};

export async function handleProjectsCardDetails(_req: Request, data: any, _cases: string) {
  const card = parse(data) as Card;

  const [cardActivities, cardMembers, cardLabels, cardAttachments, cardProject, card_Company] = await Promise.all([
    CardActivity.findAll({
      where: { card_id: card.id },
      attributes: ['id', 'description', 'created_at', 'updated_at'],
      include: [
        {
          model: User,
          as: 'createdByUser',
          attributes: ['id', 'first_name', 'last_name', 'email', 'contact', 'profile_image', 'username'],
        },
      ],
      order: [['id', 'DESC']],
    }),

    CardMember.findAll({
      where: { card_id: card.id },
      attributes: ['id', 'user_id', 'card_id', 'created_by'],
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'first_name', 'last_name', 'email', 'contact', 'profile_image', 'username'],
        },
      ],
    }),
    CardLabel.findAll({
      where: { card_id: card.id },
      attributes: ['id', 'label_id', 'card_id', 'created_by'],
      include: [
        {
          model: Label,
          as: 'label',
          attributes: ['id', 'title', 'color', 'created_by'],
        },
      ],
    }),
    CardAttachment.findAll({
      where: { card_id: card.id },
      attributes: ['id', 'attachment_url', 'card_id', 'created_by', 'is_funded_documents'],
    }),
    Project.findOne({
      where: { card_id: card.id },
      include: [
        {
          model: ProjectNotes,
          as: 'project_notes',
        },
        {
          model: ProjectQuote,
          as: 'project_quotes',
          include: [
            {
              model: Quotes,
              as: 'quote',
            },
          ],
        },
        {
          model: Course,
          as: 'courses',
          include: [
            {
              model: LessonSessionApproval,
              as: 'lessonSessionApproval',
              include: [
                {
                  model: User,
                  as: 'assignedToUser',
                  attributes: ['id', 'full_name', 'first_name', 'last_name', 'email', 'username'],
                  include: [
                    {
                      model: Trainer,
                      as: 'trainer',
                    },
                  ],
                },
              ],
            },
            {
              model: CourseParticipates,
              as: 'course_participates',
              attributes: ['id'],
            },
            {
              model: Lesson,
              as: 'lessons',
              include: [
                {
                  model: LessonSession,
                  as: 'lesson_sessions',
                },
              ],
            },
          ],
        },
      ],
    }),
    CardCompany.findAll({
      where: { card_id: card.id },

      include: [
        {
          model: Company,
        },
      ],
      order: [['id', 'DESC']],
    }),
  ]);

  card.card_activities = cardActivities;
  card.card_attachments = cardAttachments;
  card.card_members = cardMembers;
  card.card_labels = cardLabels;
  card.project = cardProject;
  card.card_Company = card_Company;
  return card;
}

export async function handleCourseCardDetails(req: Request, data: any, _cases: string) {
  const user = req?.tokenData?.user;

  const card = parse(data) as Card;

  const [cardActivities, cardMembers, cardLabels, cardAttachments, cardCourses] = await Promise.all([
    CardActivity.findAll({
      where: { card_id: card.id },
      attributes: ['id', 'description', 'created_at', 'updated_at'],
      include: [
        {
          model: User,
          as: 'createdByUser',
          attributes: ['id', 'first_name', 'last_name', 'email', 'contact', 'profile_image', 'username'],
        },
      ],
      order: [['id', 'DESC']],
    }),
    CardMember.findAll({
      where: { card_id: card.id, ...(user.role_name === RoleEnum.TrainingSpecialist ? { user_id: user.id } : {}) },
      attributes: ['id', 'user_id', 'card_id', 'created_by'],
      include: [
        {
          model: User,
          as: 'member',
          attributes: ['id', 'first_name', 'last_name', 'email', 'contact', 'profile_image', 'username'],
        },
      ],
    }),
    CardLabel.findAll({
      where: { card_id: card.id },
      attributes: ['id', 'label_id', 'card_id', 'created_by'],
      include: [
        {
          model: Label,
          as: 'label',
          attributes: ['id', 'title', 'color', 'created_by'],
        },
      ],
    }),
    CardAttachment.findAll({
      where: { card_id: card.id },
      attributes: ['id', 'attachment_url', 'card_id', 'created_by', 'show_trainer', 'show_company_manager'],
    }),

    Course.findAll({
      where: { card_id: card.id },
      include: [
        {
          model: Lesson,
          as: 'lessons',
          include: [
            {
              model: LessonSession,
              as: 'lesson_sessions',
            },
          ],
        },
        {
          model: Project,
          as: 'projects',
          attributes: ['id', 'card_id'],
          include: [
            {
              model: ProjectQuote,
              attributes: ['id'],
              include: [
                {
                  model: Quotes,
                  attributes: ['id'],
                  include: [
                    {
                      model: QuoteProduct,
                      attributes: ['id', 'code_id', 'product_total_amount', 'units'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ]);

  if (user.role_name === RoleEnum.TrainingSpecialist && !cardMembers.length) {
    return null;
  }
  card.card_activities = cardActivities;
  card.card_attachments = cardAttachments;
  card.card_members = cardMembers;
  card.card_labels = cardLabels;
  card.courses = cardCourses;

  return card;
}

export async function handleDefault(_req: Request, data: any, _cases: string) {
  return data;
}

export const additionalQueries = async (req: Request, data: any, cases: string) => {
  const selectedHandler = caseHandlers[cases] || caseHandlers.default;
  return await selectedHandler(req, data, cases);
};
