import { FeaturesEnum, PermissionEnum } from '../../../common/constants/enum.constant';
import { Routes } from '../../../common/interfaces/general/routes.interface';
import authMiddleware from '../../../middlewares/auth.middleware';
import checkRoleMiddleware from '../../../middlewares/checkRole.middleware';
import { Router } from 'express';
import PermissionController from '../controller/permission.controller';

export default class PermissionRoute implements Routes {
  public path = '/permission';
  public router = Router();
  public permissionController = new PermissionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all permission
    this.router.get(
      `${this.path}/get-all`,
      [authMiddleware, checkRoleMiddleware(FeaturesEnum.Permissions, PermissionEnum.View)],
      // validationMiddleware(),
      this.permissionController.getAllPermissions,
    );
  }
}
