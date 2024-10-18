import { RoleEnum, queryBuildCases } from '@/common/constants/enum.constants';
import { DEFAULT_COURSE_MANAGEMENT_STAGES } from '@/common/constants/projectManagement.constant';
import { parse } from '@/common/utils';
import CardCompany from '@/sequelizeDir/models/cardCompany.model';
import CompanyManager from '@/sequelizeDir/models/companyManager.model';
import { CourseStatus } from '@/sequelizeDir/models/types/course.model.type';
import { AssignedStatus } from '@/sequelizeDir/models/types/lessonSessionApproval.model.type';
import { Request } from 'express';
import { Op } from 'sequelize';

export const conditionSetter = async (req: Request, _modelName: any, cases: string) => {
  let where = {};
  if (cases == queryBuildCases.default) {
    where = {};
  }

  if (cases === queryBuildCases.getCMSContentPages) {
    where = {
      $section_names$: {
        [Op.ne]: '',
      },
      ...(req.query.searchText && {
        [Op.or]: [
          {
            $page_title_it$: {
              [Op.like]: `%${req.query.searchText}%`,
            },
          },
          {
            $page_title_de$: {
              [Op.like]: `%${req.query.searchText}%`,
            },
          },
          {
            $page_title$: {
              [Op.like]: `%${req.query.searchText}%`,
            },
          },
        ],
      }),
    };
  }

  if (cases == queryBuildCases.getUsersNotInCompanyProvided) {
    where = {
      ...(req.query.companyId
        ? {
            '$managers.company_manager.company_id$': {
              [Op.ne]: req.query.companyId,
            },
          }
        : {}),
    };
  }
  if (cases == queryBuildCases.getAllCalendarEvents) {
    let managerWhere = {};
    if (parse(req?.tokenData?.user)?.role_name === RoleEnum.CompanyManager) {
      const companiesIds = await CompanyManager.findAll({ where: { manager_id: req?.tokenData?.user?.manager?.id } }).then(
        (record) => record.map((r) => r.company_id),
      );
      const companyCards = await CardCompany.findAll({
        where: {
          company_id: {
            [Op.in]: companiesIds,
          },
        },
      }).then((record) => record.map((data) => data.card_id));
      managerWhere = {
        [Op.or]: {
          '$course.card_id$': {
            [Op.in]: companyCards,
          },
          '$course.enrolled_courses.company_id$': { [Op.in]: companiesIds },
        },
      };
    }
    let draftCourseRemoveWhere = {};
    if ([RoleEnum.TrainingSpecialist, RoleEnum.Admin, RoleEnum.Trainer].includes(parse(req?.tokenData?.user)?.role_name)) {
      draftCourseRemoveWhere = {
        [Op.or]: [
          {
            '$course.card.stage.name$': {
              [Op.notIn]: [
                DEFAULT_COURSE_MANAGEMENT_STAGES.DATE_REQUESTED,
                DEFAULT_COURSE_MANAGEMENT_STAGES.COURSES_TO_BE_ORGANIZED_ON_STANDBY,
                DEFAULT_COURSE_MANAGEMENT_STAGES.COURSE_REJECTED,
              ],
            },
          },
          {
            [Op.and]: [
              {
                '$course.lessonSessionApproval.assigned_to_status$': {
                  [Op.not]: AssignedStatus.Rejected,
                },
              },
              {
                '$course.lessonSessionApproval.trainer_assigned_to_status$': AssignedStatus.Accepted,
              },
              {
                ...(RoleEnum.Trainer === parse(req?.tokenData?.user)?.role_name
                  ? {
                      '$course.lessonSessionApproval.assigned_to$': req?.tokenData?.user?.id,
                    }
                  : {}),
              },
            ],
          },
          {
            '$course.status$': CourseStatus.publish,
          },
        ],
      };
    }

    where = {
      ...(req.query.course_id
        ? {
            '$course.id$': {
              [Op.in]: (req?.query?.course_id as string).split(','),
            },
          }
        : {}),
      ...(req.query.trainer_id
        ? {
            '$course.lessonSessionApproval.assigned_to$': (req?.query?.trainer_id as string)?.split(','),
          }
        : {}),
      ...(parse(req?.tokenData?.user)?.role_name === RoleEnum.CompanyManager ? managerWhere : {}),
      ...draftCourseRemoveWhere,
    };
  }

  if (cases === queryBuildCases.getCourseByStages) {
    where = {
      ...(req.query.project_id
        ? {
            '$cards->courses.project_id$': req.query.project_id,
          }
        : {}),
    };
  }
  if (cases === queryBuildCases.getManagerDetails) {
    where = {
      ...(req.query.username
        ? {
            '$user.username$': req.query.username,
          }
        : {}),
      ...(req.query.companyId
        ? {
            '$company_manager.company_id$': req.query.companyId,
          }
        : {}),
    };
  }
  if (cases === queryBuildCases.getAvailableResources) {
    where = {
      // '$trainerAssignedRoomResources.id$': null,
      // ...(req?.query?.course_id
      //   ? {
      //       '$trainerAssignedRoomResources.course_id$': {
      //         [Op.ne]: req?.query?.course_id,
      //       },
      //     }
      //   : {}),
    };
  }

  if (cases === queryBuildCases.getAvailableRooms) {
    where = {
      // '$trainerAssignedRoomResources.id$': null,
    };
  }
  return where;
};
