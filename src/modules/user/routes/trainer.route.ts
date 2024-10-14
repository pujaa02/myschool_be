import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constants';
import { Routes } from '@/common/interfaces/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import { fileUpload } from '@/middlewares/multer.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import trainerController from '../controller/trainer.controller';
import {
  acceptCourseBundleSchema,
  acceptSchema,
  getFilteredTrainersSchema,
  getTrainerCourseBundleSchema,
  getTrainerCourseSchema,
  rejectCourseBundleSchema,
  rejectSchema,
  trainerNotesValidationSchema,
  trainerSurveyValidationSchema,
  updateTrainerDataSchema,
  updateTrainerSchema,
} from '../validationSchema/trainer.validation';
import { trainerNotesParamSchema } from '../validationSchema/user.validation';

export default class TrainerRoute implements Routes {
  public path = '/trainer';
  public router = Router();
  public trainerController = new trainerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(`${this.path}/courses/attendance-sheet/assign`).put(
      fileUpload(1),
      authMiddleware,

      validationMiddleware(updateTrainerDataSchema, 'body'),
      this.trainerController.updateAttendanceSheet,
    );
    this.router
      .route(`${this.path}/:username`)
      .patch(
        authMiddleware,
        fileUpload(1),
        checkRoleMiddleware(FeaturesEnum.Trainer, PermissionEnum.Update),
        validationMiddleware(updateTrainerSchema, 'body'),
        this.trainerController.updateTrainer,
      );

    this.router.route(`${this.path}/courses`).get(
      authMiddleware,
      // checkRoleMiddleware(FeaturesEnum.TrainerCourse, PermissionEnum.View),
      validationMiddleware(getTrainerCourseSchema, 'query'),
      this.trainerController.getAllCourseOfTrainer,
    );

    this.router
      .route(`${this.path}/with-filters`)
      .get(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.Trainer, PermissionEnum.View),
        validationMiddleware(getFilteredTrainersSchema, 'query'),
        this.trainerController.getAllFilteredTrainer,
      );

    this.router
      .route(`${this.path}/courses/invites/reject`)
      .put(fileUpload(0), authMiddleware, validationMiddleware(rejectSchema, 'body'), this.trainerController.rejectCourse);

    this.router
      .route(`${this.path}/courses/invites/accept`)
      .put(fileUpload(0), authMiddleware, validationMiddleware(acceptSchema, 'body'), this.trainerController.acceptCourse);

    this.router
      .route(`${this.path}/courses/invites`)
      .get(
        authMiddleware,
        validationMiddleware(getTrainerCourseSchema, 'query'),
        this.trainerController.getAllCourseInvitationOfTrainer,
      );

    this.router
      .route(`${this.path}/bundle/invites`)
      .get(
        authMiddleware,
        validationMiddleware(getTrainerCourseBundleSchema, 'query'),
        this.trainerController.getAllCourseBundleInvitationOfTrainer,
      );

    this.router
      .route(`${this.path}/courses/bundle/invites`)
      .get(
        authMiddleware,
        validationMiddleware(getTrainerCourseBundleSchema, 'query'),
        this.trainerController.getAllCourseBundlesInvitationOfTrainer,
      );

    this.router
      .route(`${this.path}/bundle/invites/reject`)
      .put(
        fileUpload(0),
        authMiddleware,
        validationMiddleware(rejectCourseBundleSchema, 'body'),
        this.trainerController.rejectCourseBundle,
      );

    this.router
      .route(`${this.path}/bundle/invites/accept`)
      .put(
        fileUpload(0),
        authMiddleware,
        validationMiddleware(acceptCourseBundleSchema, 'body'),
        this.trainerController.acceptCourseBundle,
      );

    this.router
      .route(`${this.path}/exam/qr`)
      .get(authMiddleware, validationMiddleware(getTrainerCourseSchema, 'query'), this.trainerController.getAllExamQR);

    this.router
      .route(`${this.path}/survey/qr`)
      .get(authMiddleware, validationMiddleware(getTrainerCourseSchema, 'query'), this.trainerController.getAllSurveyQR);

    this.router
      .route(`${this.path}/survey-rating`)
      .get(
        authMiddleware,
        validationMiddleware(trainerSurveyValidationSchema, 'query'),
        this.trainerController.getAllSurveyTrainerRating,
      );

    this.router
      .route(`${this.path}/courses/attendance-sheet`)
      .get(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.CourseAttendanceSheet, PermissionEnum.View),
        validationMiddleware(getTrainerCourseSchema, 'query'),
        this.trainerController.getAttendanceSheet,
      );

    this.router
      .route(`${this.path}/attendance-sheet-module-data`)
      .get(authMiddleware, this.trainerController.getAllAttendanceSheetModuleData);

    this.router.route(`${this.path}/dropdown`).get(authMiddleware, this.trainerController.getTrainerDropDownList);

    //trainer notes

    this.router.route(`${this.path}/notes`).get(authMiddleware, this.trainerController.getTrainerNotesList);

    this.router
      .route(`${this.path}/notes/:slug`)
      .delete(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Delete),
        validationMiddleware(trainerNotesParamSchema, 'params'),
        this.trainerController.deleteTrainerNotes,
      );

    this.router
      .route(`${this.path}/notes`)
      .post(
        authMiddleware,
        checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Create),
        validationMiddleware(trainerNotesValidationSchema, 'body'),
        this.trainerController.addTrainerNotes,
      );
  }
}
