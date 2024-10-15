import { Routes } from '@/common/interfaces/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import { Router } from 'express';
import FeatureController from '../controller/feature.controller';
import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';

export default class FeatureRoute implements Routes {
  public path = '/feature';
  public router = Router();
  public featureController = new FeatureController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all feature
    this.router.get(
      `${this.path}/get-all`,
      [authMiddleware, checkRoleMiddleware(FeaturesEnum.Feature, PermissionEnum.View)],
      // validationMiddleware(),
      this.featureController.getAllFeatures,
    );
    this.router.route(`${this.path}/dropdown`).get(authMiddleware, this.featureController.getFeatureDropDownList);
  }
}
