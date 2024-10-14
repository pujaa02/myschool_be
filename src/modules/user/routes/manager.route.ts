import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constants';
import { Routes } from '@/common/interfaces/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import CourseController from '@/modules/courses/controller/course.controller';
import { getCourseSchema, getManagerCourseSchema } from '@/modules/courses/validations/course.validation';
import { Router } from 'express';
import multer from 'multer';
import ManagerController from '../controller/manager.controller';
import { createManagerSchema, updateManagerSchema } from '../validationSchema/manager.validation';

export default class ManagerRoute implements Routes {
  public path = '/managers';
  public router = Router();
  public managerController = new ManagerController();
  public courseController = new CourseController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // get all short course
    this.router.get(
      this.path + '/course/all',
      validationMiddleware(getManagerCourseSchema, 'query'),
      this.courseController.getCourseListCourseManager,
    );

    // get all short course
    this.router.get(
      this.path + '/course/enrolled/:company_id',
      authMiddleware,
      validationMiddleware(getCourseSchema, 'query'),
      this.courseController.getCourseManagerEnrolledCourseList,
    );

    // get all short course
    this.router.get(
      this.path + '/course/enrolled/manager/:manager_id',
      authMiddleware,
      validationMiddleware(getCourseSchema, 'query'),
      this.courseController.getManagerCoursesData,
    );

    this.router
      .route(`${this.path}`)
      .post(
        multer().none(),
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Create),
        validationMiddleware(createManagerSchema, 'body'),
        this.managerController.createManager,
      )
      .get(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View),
        this.managerController.getAllManagersDetails,
      );

    //open to all authenticated user routes
    this.router.route(`${this.path}/dropdown`).get(authMiddleware, this.managerController.getManagerDropDownList);

    this.router
      .route(`${this.path}/get-managers-for-company`)
      .get(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View),
        this.managerController.getManagersForCompany,
      );

    this.router
      .route(`${this.path}/company-manager/:id(\\d+)`)
      .delete(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Delete),
        this.managerController.deleteCompanyManager,
      );

    this.router
      .route(`${this.path}/:username`)
      .patch(
        multer().none(),
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Update),
        validationMiddleware(updateManagerSchema, 'body'),
        this.managerController.updateManager,
      )
      .get(authMiddleware, checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View), this.managerController.getManagerDetail);
  }
}
