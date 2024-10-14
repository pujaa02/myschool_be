import { FeaturesEnum, PermissionEnum, RoleEnum, queryBuildCases } from '@/common/constants/enum.constants';
import { FILE_FIELD_ENUMS } from '@/common/constants/multer.constants';
import { HttpException } from '@/common/helpers/response/httpException';
import { getModuleDataTranslation, manageJunctionTableTranslation } from '@/common/helpers/translation';
import { getAllDetails } from '@/common/lib/query/querySetter/database.helper';
import { createLogMessage } from '@/common/lib/query/querySetter/databaseCommon.helper';
import * as json from '@/common/systemLogs/systemLog.json';
import { generateSlugifyForModel, parse } from '@/common/utils';
import BaseRepository, { CustomDestroyOptions } from '@/modules/common/base.repository';
import RoleRepo from '@/modules/role/repository/role.repository';
import LogRepo from '@/modules/systemLogs/repository/systemLog.repository';
import Course from '@/sequelizeDir/models/course.model';
import CourseSubCategory from '@/sequelizeDir/models/courseSubCategory.model';
import Trainer from '@/sequelizeDir/models/trainer.model';
import TrainerAttachment from '@/sequelizeDir/models/trainerAttachment.model';
import TrainerNotes from '@/sequelizeDir/models/trainerNotes.model';
import TrainerSubCategory from '@/sequelizeDir/models/trainerSubCategory.model';
import User from '@/sequelizeDir/models/user.model';
import { Request } from 'express';
import _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import { BuildTrainerArgs, BuildTrainerResp, UpdateTrainerArgs } from '../interfaces/trainer.interface';
import { trainerUpdateReq } from '../normalizer/trainer-update.normalizer';
import UserRepo from './user.repository';

export default class TrainerRepo extends BaseRepository<Trainer> {
  private readonly roleRepository = new RoleRepo();
  private logRepo = new LogRepo();

  constructor() {
    super(Trainer.name);
  }

  readonly createTrainerRepo = async (trainerArgs: BuildTrainerArgs): Promise<BuildTrainerResp> => {
    const { data, transaction, user, tokenData, files } = trainerArgs;

    const { moduleIdLangMap: trainerIdLangMap } = await getModuleDataTranslation(Trainer.name, {
      data: {
        ...data,
        user_id: Object.values(user?.userIdLangMap)[0],
      },
      fields: [],
      slugKeyModule: 'slug',
      transaction,
      user_id: tokenData.user.id,
      onlyDefaultLang: true,
      tokenData,
      convert: false,
    });
    const newAttachments: string[] = [];
    _.forEach(files || [], (file: Express.MulterS3.File) => {
      if (file.fieldname === FILE_FIELD_ENUMS.TRAINER_ATTACHMENT) {
        newAttachments.push(file.path);
      }
    });
    await Promise.all(
      newAttachments.map(async (attachment) => {
        await getModuleDataTranslation(TrainerAttachment.name, {
          data: {
            attachment_url: attachment,
          },
          fields: [],
          slugKeyModule: 'slug',
          transaction,
          user_id: tokenData.user.id,
          onlyDefaultLang: true,
          relation_field: [{ model_association_key: 'trainer_id', model_id: trainerIdLangMap.italian, model_name: Trainer.name }],
          tokenData,
          convert: false,
        });
      }),
    );

    return {
      trainerIdLangMap,
    };
  };

  readonly getCourseIdBySlug = async (req: Request) => {
    if (!_.isUndefined(req.query.course_slug)) {
      const courseData = await Course.findOne({
        where: { slug: String(req.query.course_slug), language: req.language },
        attributes: ['id', 'start_date', 'end_date'],
      });
      if (courseData) _.set(req.query, 'course_id', parse(courseData)?.id);
      return courseData;
    }
  };

  readonly updateTrainer = async (req: Request) => {
    const { tokenData, transaction, files } = req;
    const username = req.params?.username;

    const { trainerUserDetails, trainerUserAdditionalDetails } = trainerUpdateReq(req);

    const userInstance = new UserRepo();
    const user = await userInstance.get({
      where: {
        username,
      },
      transaction,
    });

    if (!user) {
      throw new HttpException(404, 'USER_NOT_FOUND');
    }

    const trainer = await this.get({ where: { user_id: user.id } });

    if (!trainer) {
      throw new HttpException(404, 'TRAINER_NOT_FOUND');
    }

    await this.updateTrainerRepo({
      data: trainerUserAdditionalDetails,
      trainer,
      transaction,
      tokenData,
      files: req.files,
    });
    const updateTrainerUser = await userInstance.updateUser({
      data: trainerUserDetails,
      user,
      transaction,
      shouldSentMail: false,
      tokenData,
      files,
    });

    return updateTrainerUser;
  };

  readonly updateTrainerRepo = async (trainerUpdateArgs: UpdateTrainerArgs) => {
    const { data, transaction, tokenData, trainer, files } = trainerUpdateArgs;
    await getModuleDataTranslation(Trainer.name, {
      data: {
        hourly_rate: data.hourly_rate,
        travel_reimbursement_fee: data.travel_reimbursement_fee,
        location: data.location,
        rate_by_admin: data.rate_by_admin,

        latitude: data.latitude,
        longitude: data.longitude,
      },

      fields: [],
      slugKeyModule: 'slug',
      transaction,
      user_id: tokenData.user.id,
      onlyDefaultLang: true,
      module_id: trainer.id,
      tokenData,
      convert: false,
    });

    await TrainerAttachment.destroy({
      where: { attachment_url: { [Op.notIn]: [...data?.trainer_attachment] }, trainer_id: trainer.id },
      transaction,
      individualHooks: true,
      tokenData,
    } as CustomDestroyOptions<TrainerAttachment>);

    const newAttachments: string[] = [];
    _.forEach(files || [], (file: Express.MulterS3.File) => {
      if (file.fieldname === FILE_FIELD_ENUMS.TRAINER_ATTACHMENT) {
        newAttachments.push(file.path);
      }
    });
    await Promise.all(
      newAttachments.map(async (attachment) => {
        await getModuleDataTranslation(TrainerAttachment.name, {
          data: {
            attachment_url: attachment,
          },
          fields: [],
          slugKeyModule: 'slug',
          transaction,
          user_id: tokenData.user.id,
          onlyDefaultLang: true,
          relation_field: [{ model_association_key: 'trainer_id', model_id: trainer.id, model_name: Trainer.name }],
          tokenData,
          convert: false,
        });
      }),
    );

    if (typeof data.subCategories === 'object') {
      await manageJunctionTableTranslation(Trainer.name, CourseSubCategory.name, TrainerSubCategory.name, {
        primaryModuleId: trainer.id,
        primaryModuleAssociationKey: 'trainer_id',
        secondaryModuleIds: [...data.subCategories],
        secondayModuleAssociationKey: 'sub_category_id',
        transaction,
        user_id: tokenData.user.id,
        onlyDefaultLang: false,
        tokenData,
      });
    }

    const trainerData = await Trainer.findOne({
      where: {
        id: trainer.id,
      },
      include: [
        {
          model: TrainerAttachment,
        },
        {
          model: TrainerSubCategory,
        },
      ],
      transaction,
    });

    return trainerData;
  };

  readonly getTrainerByUserId = async (user_id: number, transaction: Transaction) => {
    return await this.get({
      where: {
        user_id,
      },
      transaction,
    });
  };

  /**
   * Create Trainer Note
   * @param { name: string } data
   * @returns {Promise<Code>}
   */

  readonly createTrainerNotes = async (req?: Request) => {
    const notesSlug = await generateSlugifyForModel(`notes`, TrainerNotes);
    const { trainer_name, ...rest } = req.body;
    const payload = {
      trainer_id: rest.trainer_id,
      notes: rest.notes,
      slug: notesSlug,
      created_by: req?.tokenData?.user?.id,
    };
    const trainerNotes = await TrainerNotes.create(payload, { transaction: req.transaction });

    await createLogMessage(
      req,
      json.TRAINER_DESCRIPTION_ADDED,
      FeaturesEnum.Trainer,
      'Trainer description added',
      trainerNotes?.id,
      this.logRepo,
      {
        additionalMessageProps: { trainerName: trainer_name },
      },
      PermissionEnum.Create,
    );
    return trainerNotes;
  };

  /**
   * Delete Trainer Note
   * @param { name: string } data
   * @returns {Promise<Code>}
   */

  readonly deleteTrainerNotes = async (req: Request) => {
    const transaction = req.transaction;
    const trainerNote = await TrainerNotes.findOne({ where: { slug: req.params.slug } });
    if (trainerNote) {
      await TrainerNotes.destroy({
        where: {
          slug: req.params.slug,
        },
        transaction,
      });
      await createLogMessage(
        req,
        json.TRAINER_DESCRIPTION_DELETED,
        FeaturesEnum.Code,
        'Trainer Description deleted',
        trainerNote.id,
        this.logRepo,
        {
          additionalMessageProps: { trainerName: req.body.trainerName },
        },
        PermissionEnum.Delete,
      );
      return trainerNote;
    } else {
      throw new HttpException(400, 'CAN_NOT_DELETE_TRAINER_NOTES');
    }
  };

  readonly getTrainerDropDownList = async (req: Request) => {
    _.set(req.query, 'dropdown', true); //strict
    _.set(req.query, 'value', 'id'); //strict
    _.set(req.query, 'label', 'full_name'); //strict

    const roleId = await this.roleRepository.get({ where: { name: RoleEnum.Trainer } });
    _.set(req.query, 'q[role_id]', roleId.id);
    return await getAllDetails(User, User.name, queryBuildCases.getTrainerDropdown, req);
  };
}
