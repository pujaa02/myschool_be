import { Routes } from '@/common/interfaces/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import { fileUpload } from '@/middlewares/multer.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import LogController from '../controller/systemLog.controller';
import { createSystemLogSchema, getSystemLogSchema } from '../validations/systemLog.validation';
import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';
import { paramsSlugSchema } from '@/common/validations';
class LogRoute implements Routes {
  public path = '/system-logs';
  public router = Router();
  public LogController = new LogController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      this.path,
      // checkRoleMiddleware(FeaturesEnum.Log, PermissionEnum.View),
      validationMiddleware(getSystemLogSchema, 'query'),
      this.LogController.getLogList,
    );

    // create system logs
    this.router.post(
      this.path,
      authMiddleware,
      fileUpload(1),
      checkRoleMiddleware(FeaturesEnum.SystemLog, PermissionEnum.Create),
      validationMiddleware(createSystemLogSchema),
      this.LogController.createSystemLog,
    );

    // delete system log
    this.router.delete(
      this.path + '/:slug',
      authMiddleware,
      checkRoleMiddleware(FeaturesEnum.SystemLog, PermissionEnum.Delete),
      validationMiddleware(paramsSlugSchema, 'params'),
      this.LogController.deleteLog,
    );
  }
}

export default LogRoute;
