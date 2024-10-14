
import { Routes } from '@/common/interfaces/general/routes.interface';
import { Router } from 'express';
import RoleController from '../controller/role.controller';
import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';

export default class RoleRoute implements Routes {
  public path = '/role';
  public router = Router();
  public roleController = new RoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all role
    this.router.get(
      `${this.path}/get-all`,
      [authMiddleware, checkRoleMiddleware(FeaturesEnum.Role, PermissionEnum.View)],
      // validationMiddleware(),
      this.roleController.getAllRoles,
    );
  }
}
