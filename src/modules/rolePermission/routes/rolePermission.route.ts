import { FeaturesEnum, PermissionEnum } from '../../../common/constants/enum.constant';
import { Routes } from '../../../common/interfaces/general/routes.interface';
import authMiddleware from '../../../middlewares/auth.middleware';
import checkRoleMiddleware from '../../../middlewares/checkRole.middleware';
import { Router } from 'express';
import RolePermissionController from '../controller/rolePermission.controller';
export default class RolePermissionRoute implements Routes {
  public path = '/role-permission';
  public router = Router();
  public rolePermissionController = new RolePermissionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all role permission
    this.router.get(
      `${this.path}/get-all`,
      [authMiddleware, checkRoleMiddleware(FeaturesEnum.RolePermission, PermissionEnum.View)],
      // validationMiddleware(),
      this.rolePermissionController.getRolePermissions,
    );
  }
}
