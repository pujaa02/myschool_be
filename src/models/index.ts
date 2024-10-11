import { Sequelize } from 'sequelize-typescript';
import User from './user.model';
import { DATABASE_URL, ENABLE_LOG, NODE_ENV } from '../config';
import { logger } from '../utils/logger';

let db: Sequelize;

export const initSequelize = () => {
  const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: +ENABLE_LOG === 1 && logger.info.bind(null, '\n%s'),
    dialectOptions: { application_name: `MySchool - ${NODE_ENV}` },
  });
  sequelize.addModels([User]);

  return sequelize;
};

if (!db) {
  db = initSequelize();
}

export default db;
