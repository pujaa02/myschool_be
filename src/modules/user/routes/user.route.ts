import { Router } from 'express';
import validationMiddleware from '../../../middlewares/validation.middleware';
import { Routes } from '../../../common/interfaces/general/routes.interface';
import UserController from '../controller/user.controller';
import { createUserSchema, updateUserSchema } from '../validationSchema/user.validation';
import { BasePermissionGroups, PermissionTypes } from '../../../common/constants/permissionGroup.constants';
import { checkPermission } from '../../../middlewares/permission.middleware';
import authMiddleware from '../../../middlewares/auth.middleware';

class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // post api
    this.router.route(`${this.path}`).post(
      authMiddleware,
      checkPermission(BasePermissionGroups.USER, PermissionTypes.CREATE),
      // fileUploadWasabi(25),
      validationMiddleware(createUserSchema, 'body'),
      this.userController.createUser,
    );
    // .put(
    //   // authMiddleware(),
    //   checkPermission(BasePermissionGroups.USER, PermissionTypes.UPDATE),
    //   // fileUploadWasabi(10),
    //   validationMiddleware(updateUserSchema, 'body'),
    //   this.userController.updateUser,
    // )
    // .delete(
    //   // authMiddleware(),
    //   checkPermission(BasePermissionGroups.USER, PermissionTypes.DELETE),
    //   validationMiddleware(userDeleteIdSchema, 'body'),
    //   this.userController.deleteAllUser,
    // )
    // .get(
    //   // authMiddleware(),
    //   checkPermission(BasePermissionGroups.USER, PermissionTypes.READ),
    //   this.userController.getUsers,
    // );

    this.router.get(`${this.path}/logged-in-user`, authMiddleware, this.userController.getLoggedInUser);

    // this.router
    //   .route(`${this.path}/get-data`)
    //   .post(
    //     // authMiddleware(),
    //     queryParser,
    //     checkPermission(BasePermissionGroups.USER, PermissionTypes.READ),
    //     this.userController.getUsers,
    //   );

    // // get api
    // this.router
    //   .route(`${this.path}/get-descendants-users`)
    //   .get(
    //     // authMiddleware(),
    //     validationMiddleware(descendantsUsersQuery, 'query'),
    //     this.userController.getDescendantsUsers,
    //   );

    // this.router
    //   .route(`${this.path}/get-hierarchy-users`)
    //   .get(
    //     // authMiddleware(),
    //      validationMiddleware(hierarchyUsersQuery, 'query'), this.userController.getHierarchyUsers);

    // this.router
    //   .route(`${this.path}/:id(\\d+)`)
    //   .put(
    //     // authMiddleware(),
    //     checkPermission(BasePermissionGroups.USER, PermissionTypes.UPDATE),
    //     // fileUploadWasabi(10),
    //     validationMiddleware(userIdSchema, 'params'),
    //     validationMiddleware(updateUserSchema, 'body'),
    //     this.userController.updateUser,
    //   )
    //   .get(
    //     // authMiddleware(),
    //     checkPermission(BasePermissionGroups.USER, PermissionTypes.READ),
    //     validationMiddleware(userIdSchema, 'params'),
    //     this.userController.getUserById,
    //   );
  }
}

export default UserRoute;
