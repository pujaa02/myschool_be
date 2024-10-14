import { manageJunctionTableTranslation } from '@/common/helpers/translation';
import BaseRepository from '@/modules/common/base.repository';
import NotificationRepo from '@/modules/notification/repository/notification.repository';
import Card from '@/sequelizeDir/models/card.model';
import CardMember from '@/sequelizeDir/models/cardMember.model';
import TrainingSpecialist from '@/sequelizeDir/models/trainerSpecialist.model';
import { NotificationTypes } from '@/sequelizeDir/models/types/notification.type';
import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import { Op, Sequelize, Transaction } from 'sequelize';
import { BuildTrainingSpecialistArgs } from '../interfaces/trainingSpecialist.interface';

export default class TrainingSpecialistRepo extends BaseRepository<TrainingSpecialist> {
  private readonly notificationRepo = new NotificationRepo();
  constructor() {
    super(TrainingSpecialist.name);
  }

  readonly createTrainingSpecialist = async (TrainingSpecialistArgs: BuildTrainingSpecialistArgs) => {
    const { transaction, user, tokenData } = TrainingSpecialistArgs;
    await TrainingSpecialist.create(
      {
        user_id: Object.values(user?.userIdLangMap)[0],
        created_by: tokenData.user.id,
        updated_by: tokenData.user.id,
      },
      { transaction },
    );
  };

  readonly getLastAssignedTrainer = async () => {
    return await this.get({
      where: {
        is_last_assigned: true,
      },
    });
  };

  readonly updateLastAssignedTrainer = async (transaction?: Transaction) => {
    const lastAssignedTrainer = await this.getLastAssignedTrainer();
    let nextTrainer = await this.get({
      where: {
        ...(lastAssignedTrainer
          ? {
              id: {
                [Op.gt]: lastAssignedTrainer.id,
              },
            }
          : {}),
      },
      order: [['id', 'ASC']],
      transaction,
    });

    if (!nextTrainer) {
      nextTrainer = await this.get({
        order: [['id', 'ASC']],
        include: [{ model: User, where: { active: USER_STATUS.ACTIVE }, required: true }],
        transaction,
      });
    }
    await this.update(
      { is_last_assigned: Sequelize.literal(`CASE WHEN id = ${nextTrainer.id} THEN true ELSE false END`) },
      { where: {}, transaction },
    );

    return nextTrainer;
  };

  readonly assignTrainerToCard = async (card_id: number, transaction?: Transaction) => {
    const trainer = await this.updateLastAssignedTrainer(transaction);
    if (trainer) {
      await manageJunctionTableTranslation(Card.name, User.name, CardMember.name, {
        primaryModuleId: card_id,
        primaryModuleAssociationKey: 'card_id',
        secondaryModuleIds: [trainer.user_id],
        secondayModuleAssociationKey: 'user_id',
        transaction,
        user_id: trainer.user_id,
        onlyDefaultLang: false,
      });
      const card = await Card.findOne({ where: { id: card_id }, transaction });
      this.notificationRepo.sendNotification(
        trainer.id,
        `You have been assigned in ${card.title}`,
        `User Mention`,
        NotificationTypes.USER,
      );
    }
  };
}
