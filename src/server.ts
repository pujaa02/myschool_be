import express, { Application } from 'express';
const app: Application = express();
import bodyParser from 'body-parser';
import db from './models';
import { PORT } from './config';
import { logger } from './common/util/logger';
const port = PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const main = async () => {
  try {
    await db.authenticate();
  } catch (err) {
    logger.error('[SERVER START]: %s', err);
    process.exit(1);
  }
};

main();
