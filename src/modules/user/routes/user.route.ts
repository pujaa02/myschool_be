import { Routes } from '../../../common/interfaces/general/routes.interface';
import authMiddleware from '../../../middlewares/auth.middleware';
import checkRoleMiddleware from '../../../middlewares/checkRole.middleware';
import validationMiddleware from '../../../middlewares/validation.middleware';
import { Router } from 'express';
import UserController from '../controller/user.controller';
import {
  bulkUploadSchema,
  createUserSchema,
  updateUserSchema,
  userUsernameParamSchema,
} from '../validationSchema/user.validation';
import { FeaturesEnum, PermissionEnum } from '../../../common/constants/enum.constant';

export default class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(`${this.path}`)
      .post(
        // multer().none(),
        // fileUpload(1),
        authMiddleware,
        validationMiddleware(createUserSchema, 'body'),
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Create),
        this.userController.createUser,
      )
      .patch(
        authMiddleware,
        // fileUpload(1),
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Update),
        validationMiddleware(updateUserSchema, 'body'),
        this.userController.updateUser,
      );
    // .get(
    //   authMiddleware,
    //   validationMiddleware(getUserSchema, 'query'),
    //   checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View),
    //   this.userController.getUserDetails,
    // );

    this.router
      .route(`${this.path}/:username`)
      .patch(
        authMiddleware,
        // fileUpload(10),
        validationMiddleware(updateUserSchema, 'body'),
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Update),
        validationMiddleware(userUsernameParamSchema, 'params'),

        this.userController.updateUser,
      )
      // .get(
      //   authMiddleware,
      //   checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View),
      //   validationMiddleware(userUsernameParamSchema, 'params'),
      //   this.userController.getUserDetailsById,
      // )
      .delete(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Delete),
        validationMiddleware(userUsernameParamSchema, 'params'),
        this.userController.deleteUser,
      );

    this.router
      .route(`${this.path}/bulkInsert`)
      .post(
        authMiddleware,
        validationMiddleware(bulkUploadSchema, 'body'),
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Create),
        this.userController.bulkCreateUser,
      );
  }
}
