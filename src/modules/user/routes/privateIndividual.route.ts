import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constants';
import { Routes } from '@/common/interfaces/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import CourseController from '@/modules/courses/controller/course.controller';
import { getCourseSchema } from '@/modules/courses/validations/course.validation';
import { Router } from 'express';
import multer from 'multer';
import PrivateIndividualController from '../controller/privateIndividual.controller';
import {
  courses,
  createPrivateIndividualSchema,
  updatePrivateIndividualSchema,
} from '../validationSchema/privateIndividual.validation';

export default class PrivateIndividualRoute implements Routes {
  public path = '/private-individual';
  public router = Router();
  public privateIndividualController = new PrivateIndividualController();
  public courseController = new CourseController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(`${this.path}`)
      .post(
        multer().none(),
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Create),
        validationMiddleware(createPrivateIndividualSchema, 'body'),
        this.privateIndividualController.createPrivateIndividual,
      )
      .get(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View),
        this.privateIndividualController.getAllPrivateIndividualDetails,
      );
    // get all short course
    this.router.get(
      this.path + '/course/all',
      validationMiddleware(courses, 'query'),
      this.privateIndividualController.getCourseList,
    );
    // get all short course
    this.router.get(
      this.path + '/course/enrolled/:private_individual_id',
      authMiddleware,
      validationMiddleware(getCourseSchema, 'query'),
      this.courseController.getCoursePrivateIndividualEnrolledCourseList,
    );
    this.router
      .route(`${this.path}/:username`)
      .patch(
        multer().none(),
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Update),
        validationMiddleware(updatePrivateIndividualSchema, 'body'),
        this.privateIndividualController.updatePrivateIndividual,
      )
      .get(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View),
        this.privateIndividualController.getPrivateIndividualDetail,
      )
      .delete(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Delete),
        this.privateIndividualController.deletePrivateIndividual,
      );
  }
}
