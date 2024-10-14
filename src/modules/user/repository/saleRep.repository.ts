import { manageJunctionTableTranslation } from '@/common/helpers/translation';
import BaseRepository from '@/modules/common/base.repository';
import NotificationRepo from '@/modules/notification/repository/notification.repository';
import Card from '@/sequelizeDir/models/card.model';
import CardMember from '@/sequelizeDir/models/cardMember.model';
import SalesRepresentatives from '@/sequelizeDir/models/salesRepresentatives.model';
import { NotificationTypes } from '@/sequelizeDir/models/types/notification.type';
import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import { Op, Sequelize, Transaction } from 'sequelize';
import { BuildSalesRepArgs } from '../interfaces/salesRep.interface';

export default class SalesRepresentativesRepo extends BaseRepository<SalesRepresentatives> {
  private readonly notificationRepo = new NotificationRepo();

  constructor() {
    super(SalesRepresentatives.name);
  }

  readonly getLastAssignedSalesRep = async () => {
    return await this.get({
      where: {
        is_last_assigned: true,
      },
    });
  };

  readonly createSalesRep = async (salesRepArgs: BuildSalesRepArgs) => {
    const { transaction, user, tokenData } = salesRepArgs;
    await SalesRepresentatives.create(
      {
        user_id: Object.values(user?.userIdLangMap)[0],
        created_by: tokenData.user.id,
        updated_by: tokenData.user.id,
      },
      { transaction },
    );
  };

  readonly updateLastAssignedSalesRep = async (transaction?: Transaction) => {
    const lastAssignedSalesRep = await this.getLastAssignedSalesRep();
    let nextSalesRep = await this.get({
      where: {
        ...(lastAssignedSalesRep
          ? {
              id: {
                [Op.gt]: lastAssignedSalesRep.id,
              },
            }
          : {}),
      },
      order: [['id', 'ASC']],
      transaction,
    });
    if (!nextSalesRep) {
      nextSalesRep = await this.get({
        include: [{ model: User, where: { active: USER_STATUS.ACTIVE }, required: true }],
        order: [['id', 'ASC']],

        transaction,
      });
    }
    await this.update(
      { is_last_assigned: Sequelize.literal(`CASE WHEN id = ${nextSalesRep.id} THEN true ELSE false END`) },
      { where: {}, transaction },
    );
    return nextSalesRep;
  };

  readonly assignSalesRepToCard = async (card_id: number, transaction?: Transaction) => {
    const SalesRep = await this.updateLastAssignedSalesRep(transaction);
    if (SalesRep) {
      await manageJunctionTableTranslation(Card.name, User.name, CardMember.name, {
        primaryModuleId: card_id,
        primaryModuleAssociationKey: 'card_id',
        secondaryModuleIds: [SalesRep.user_id],
        secondayModuleAssociationKey: 'user_id',
        transaction,
        user_id: SalesRep.user_id,
        onlyDefaultLang: false,
        allowDuplication: true,
      });

      const card = await Card.findOne({ where: { id: card_id }, transaction });
      this.notificationRepo.sendNotification(
        SalesRep.id,
        `You have been assigned in ${card.title}`,
        `User Mention`,
        NotificationTypes.USER,
      );
    }
  };
}
