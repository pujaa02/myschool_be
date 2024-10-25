import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { NODE_ENV, PORT } from './config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './models';
import { Transaction } from 'sequelize';
import { Routes } from './common/interfaces/general/routes.interface';
import { logger } from './common/util/logger';
import * as http from 'http';
import errorMiddleware from './middlewares/error.middleware';

const app: Application = express();
const env: string = NODE_ENV || 'development';
const port: string | number = PORT || 8000;

function initializeMiddleWares() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  //   app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    global.currentRequest = req;
    global.currentResponse = res;
    next();
  });

  app.use(async (req, res, next) => {
    const method = req.method.toLowerCase();
    if (method !== 'get') {
      const t: Transaction = await db.transaction();
      req.transaction = t;
    }
    next();
  });
}
function initializeRoutes(routes: Routes[]) {
  routes.forEach((route) => {
    app.use('/api/v1', route.router);
  });
}

function initializeErrorHandling() {
  app.use(errorMiddleware);
}

function handle404() {
  app.use((req, res) => {
    if (req.transaction) {
      req.transaction.rollback();
    }

    res.status(500).send('Something went wrong');
  });
}
export const initializeApp = async (apiRoutes: Routes[]) => {
  initializeMiddleWares();
  initializeRoutes(apiRoutes);
  initializeErrorHandling();
  handle404();
  const server = http.createServer(app);
  //   socket.connect(server);
  server.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} ========`);
    logger.info(`=================================`);
  });
};
