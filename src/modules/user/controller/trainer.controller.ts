import { queryBuildCases } from '@/common/constants/enum.constants';
import { generalResponse } from '@/common/helpers/response/generalResponse';
import { getAllDetails } from '@/common/lib/query/querySetter/database.helper';
import { catchAsync, parse } from '@/common/utils';
import { getDistance } from '@/lib/google/google-apis.service';
import CourseAttendanceRepo from '@/modules/courses/repository/courseAttendanceSheet.repository';
import Course from '@/sequelizeDir/models/course.model';
import CourseBundle from '@/sequelizeDir/models/courseBundle.model';
import CourseLumpSumAmount from '@/sequelizeDir/models/courseLumpsumAmont.model';
import CourseParticipates from '@/sequelizeDir/models/courseParticipates.model';
import LessonSession from '@/sequelizeDir/models/lessonSession.model';
import LessonSessionApproval from '@/sequelizeDir/models/lessonSessionApproval.model';
import SurveyResult from '@/sequelizeDir/models/surveyResult.model';
import TrainerNotes from '@/sequelizeDir/models/trainerNotes.model';
import { CourseModeEnum } from '@/sequelizeDir/models/types/course.model.type';
import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import { differenceInHours, parseISO } from 'date-fns';
import { Request, Response } from 'express';
import _ from 'lodash';
import { Sequelize } from 'sequelize';
import TrainerRepo from '../repository/trainer.repository';

export default class ManagerController {
  private trainerRepository = new TrainerRepo();
  private courseAttendanceRepo = new CourseAttendanceRepo();
  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllCourseOfTrainer = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(Course, Course.name, queryBuildCases.getAllCourseOfTrainer, req);
    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  public getAllFilteredTrainer = catchAsync(async (req: Request, res: Response) => {
    const lessonDates = req?.query?.dates;
    let courseIds = [];
    let allAssignedTrainers: any = req?.query?.allAssignedTrainers ? String(req?.query?.allAssignedTrainers).split(',') : [];
    allAssignedTrainers = allAssignedTrainers.map((e) => Number(e));
    let selectedTrainer = { data: [] };

    if (req?.query?.course_bundle_slug) {
      const courseBundle = await CourseBundle.findOne({ where: { slug: String(req?.query?.course_bundle_slug) } });
      const courses = await Course.findAll({ where: { course_bundle_id: courseBundle?.id } });
      courseIds = courses.map((c) => c?.id);
      _.set(req?.query, 'courseIds', courseIds);
      selectedTrainer = await getAllDetails(User, User.name, queryBuildCases.getSelectedTrainer, req);
    } else if (req?.query?.course_slug) {
      const courses = await Course.findAll({ where: { slug: String(req?.query?.course_slug).split(',') } });
      courseIds = courses.map((c) => c?.id);
      _.set(req?.query, 'courseIds', courseIds);
      selectedTrainer = await getAllDetails(User, User.name, queryBuildCases.getSelectedTrainer, req);
    }

    _.set(req, 'query', {});
    _.set(req.query, 'dates', lessonDates);
    const suggestedData = await getAllDetails(User, User.name, queryBuildCases.getAllFilteredTrainers, req);

    let mergedData = await this.mergerData(selectedTrainer?.data, suggestedData?.data);

    _.set(req, 'query', {});
    _.set(req.query, 'dates', lessonDates);
    req.query.dates = lessonDates;
    req.query.view = String(true);
    req.query.courseIds = courseIds;

    const allData = await getAllDetails(User, User.name, queryBuildCases.getAllTrainers, req);
    mergedData = await this.mergerData(mergedData, allData.data);
    mergedData = mergedData.filter((r) => !_.isNull(r));
    mergedData = _.orderBy(mergedData, ['assigned', 'suggested']);
    const selectedUnavailable = [];
    const findUnavailableData = _.difference(
      allAssignedTrainers,
      mergedData.map((e) => e.id),
    );
    for (const id of findUnavailableData) {
      const record = await User.findOne({
        where: { id, active: USER_STATUS.ACTIVE },
        attributes: ['id', 'first_name', 'last_name', 'profile_image'],
      });

      selectedUnavailable.push({
        name: record?.full_name,
        email: record?.email,
        username: record?.username,
        profile_image: record?.profile_image,
        id: record?.id,
        role_name: record?.role?.name,
        rate: record?.trainer?.trainerSurvey.reduce((acc, val) => acc + val.rate, 0) / record?.trainer?.trainerSurvey.length,
        selected_status: 'unavailable',
        assigned: true,
      });
    }
    mergedData = [...mergedData, ...selectedUnavailable];
    return generalResponse(req, res, mergedData, 'TRAINER_GETALL', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllCourseInvitationOfTrainer = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(Course, Course.name, queryBuildCases.getAllCourseInvitationOfTrainer, req);

    if (req?.query?.course_slug) {
      const courseData = await Course.findOne({
        where: { slug: String(req?.query?.course_slug), parent_table_id: null },
        attributes: [
          'id',
          'type',
          'price',
          'parent_table_id',
          [
            Sequelize.literal(
              `(select  SUM(TIMESTAMPDIFF(HOUR, start_time, end_time)) AS difference from lesson_sessions ls where course_id=Course.id)`,
            ),
            'hours',
          ],
        ],
      });
      const lumpsum = await CourseLumpSumAmount.findOne({
        where: {
          trainer_id: req?.tokenData?.user.id,
          course_id: courseData?.id,
        },
      });

      if (data?.lessonSessionApproval) {
        data.lessonSessionApproval = _.orderBy(data?.lessonSessionApproval, ['id'], ['desc']);
        const hasFullApproval = data?.lessonSessionApproval.find((lsa) => lsa.is_full_course && !lsa.lesson_session_id);
        const hasFullApprovalIndex = data?.lessonSessionApproval.findIndex((lsa) => lsa.is_full_course && !lsa.lesson_session_id);
        let totalDistanceData = 0;
        const lessonIds = [];
        const lessonSessionApproval = [];
        for (const r of data.lessonSessionApproval) {
          r.trainerHourlyCharge = req?.tokenData?.user?.trainer?.hourly_rate;
          r.travelFees = req?.tokenData?.user?.trainer?.travel_reimbursement_fee;
          r.hours = Number(parse(courseData)?.hours) || 0;
          if (r?.lessonSessions && !hasFullApproval) {
            r.hours = differenceInHours(parseISO(r?.lessonSessions?.end_time), parseISO(r?.lessonSessions?.start_time));
          }
          r.totalDays = 1;
          let distanceValue = 0;

          if (r?.lessons && r?.lessons?.mode !== CourseModeEnum.VideoConference) {
            const origin = (r as LessonSessionApproval)?.assignedToUser?.trainer?.location;
            const destination = r?.lessons?.location;

            const tempDistance = destination && origin ? await getDistance(origin, destination) : 0;
            distanceValue = _.isObject(tempDistance) ? parseInt(tempDistance.distance, 10) : 0;
            if (!lessonIds.includes(r?.lessons?.id)) totalDistanceData += distanceValue;
            lessonIds.push(r?.lessons?.id);
          }

          r.totalDistance = distanceValue;
          r.hourlyRate = r.trainerHourlyCharge * r.hours;
          r.totalTravelFees = r.travelFees * r.totalDistance;
          r.mode = r?.lessons?.mode;
          r.totalNetFees = r.totalTravelFees + r.trainerHourlyCharge;
          r.is_lumpsum_select = false;
          r.totalNetFees = r.totalTravelFees + r.hourlyRate;
          if (lumpsum) {
            r.is_lumpsum_select = true;
            r.reimbursement_amount = lumpsum.reimbursement_amount;
            r.amount = lumpsum.amount;
          }
          lessonSessionApproval.push(r);
        }

        data.lessonSessionApproval = lessonSessionApproval;
        data.lessonSessionApproval[hasFullApprovalIndex] = {
          ...hasFullApproval,
          totalDistance: totalDistanceData,
        };
      }
    }
    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  public getAllCourseBundleInvitationOfTrainer = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(
      LessonSessionApproval,
      LessonSessionApproval.name,
      queryBuildCases.getAllCourseBundleInvitationOfTrainer,
      req,
    );
    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  public getAllCourseBundlesInvitationOfTrainer = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(
      LessonSessionApproval,
      LessonSessionApproval.name,
      queryBuildCases.getAllCourseBundlesInvitationOfTrainer,
      req,
    );
    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * update
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public rejectCourse = catchAsync(async (req: Request, res: Response) => {
    const data = await this.courseAttendanceRepo.rejectCourses(req, {
      ...req.body,
    });

    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * update
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public rejectCourseBundle = catchAsync(async (req: Request, res: Response) => {
    const data = await this.courseAttendanceRepo.rejectCoursesBundle(req, {
      ...req.body,
    });
    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * update
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public acceptCourse = catchAsync(async (req: Request, res: Response) => {
    const data = await this.courseAttendanceRepo.acceptCourse(req, {
      ...req.body,
    });

    return generalResponse(req, res, data, 'COURSE_INVITE_ADDED_SUCCESS', true);
  });

  /**
   * update
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public acceptCourseBundle = catchAsync(async (req: Request, res: Response) => {
    const data = await this.courseAttendanceRepo.acceptCourseBundle(req, {
      ...req.body,
    });

    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllExamQR = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(Course, Course.name, queryBuildCases.getQROfExam, req);
    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllSurveyQR = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(Course, Course.name, queryBuildCases.getQROfSurvey, req);
    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllSurveyRating = async (req: Request, res: Response) => {
    const data = await getAllDetails(SurveyResult, SurveyResult.name, queryBuildCases.getAllRating, req);
    const scaleAvg = 0;
    let rateAvg;
    let total = 0;

    if (data?.data?.length > 0) {
      for (const surveyData of data?.data) {
        if (surveyData?.survey_question) {
          total += surveyData.rate;
        }
      }
      const adminRate = !_.isUndefined(data?.data[0]?.courseTrainer?.rate_by_admin);

      rateAvg = (
        ((total + (adminRate ? data?.data[0]?.courseTrainer?.rate_by_admin : 0) / data?.data?.length) * 5) /
        100
      ).toFixed(2);
    }

    return { rateAvg };
  };

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllSurveyTrainerRating = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(SurveyResult, SurveyResult.name, queryBuildCases.getAllRating, req);

    const scaleAvg = 0;
    let rateAvg;
    let total = 0;

    for (const surveyData of data?.data) {
      if (surveyData?.survey_question) {
        total += surveyData.rate;
      }
    }
    const adminRate = !_.isUndefined(data?.data[0]?.courseTrainer?.rate_by_admin);

    rateAvg = (((total + (adminRate ? data?.data[0]?.courseTrainer?.rate_by_admin : 0) / data?.data?.length) * 5) / 100).toFixed(
      2,
    );

    return generalResponse(req, res, { rateAvg }, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAttendanceSheet = catchAsync(async (req: Request, res: Response) => {
    const course = await this.trainerRepository.getCourseIdBySlug(req);
    if (req?.query?.lesson_session_id) {
      const lsa = await LessonSession.findOne({ where: { id: Number(req?.query?.lesson_session_id) } });
      if (lsa) {
        const lsaData = await LessonSession.findOne({ where: { slug: lsa?.slug, language: req?.language } });
        _.set(req?.query, 'lesson_session_id', lsaData.id);
      }
    }
    const data = await getAllDetails(CourseParticipates, CourseParticipates.name, queryBuildCases.getAttendanceSheet, req);
    return generalResponse(req, res, { participates: data, course }, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * update
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public updateAttendanceSheet = catchAsync(async (req: Request, res: Response) => {
    const data = await this.courseAttendanceRepo.updateAttendanceSheetOfParticipate(req, {
      ...req.body,
      files: req.files,
    });

    return generalResponse(req, res, data, 'TRAINER_COURSE_SUCCESS', false);
  });

  /**
   * get
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public getAllAttendanceSheetModuleData = catchAsync(async (req: Request, res: Response) => {
    const data = await getAllDetails(
      LessonSessionApproval,
      LessonSessionApproval.name,
      queryBuildCases.getAllCourseOfTrainer,
      req,
    );
    return generalResponse(req, res, data, 'MANAGER_GETALL', false);
  });

  /**
   * Create trainer
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  public updateTrainer = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.trainerRepository.updateTrainer(req);
    return generalResponse(req, res, responseData, 'TRAINER_UPDATE', false);
  });

  public getTrainerDropDownList = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.trainerRepository.getTrainerDropDownList(req);
    return generalResponse(req, res, responseData, 'TRAINER_GETALL', false);
  });

  public mergerData = async (array1, array2) => {
    const mergeArraysCustomize = (objValue, srcValue) => {
      if (_.isObject(objValue)) {
        return _.mergeWith(objValue, srcValue, mergeArraysCustomize);
      }
    };

    const mergedArray = _.mergeWith(_.keyBy(array1, 'id'), _.keyBy(array2, 'id'), mergeArraysCustomize);
    const result = _.values(mergedArray);
    return result;
  };

  //  trainer notes
  public getTrainerNotesList = catchAsync(async (req: Request, res: Response) => {
    const responseData = await getAllDetails(TrainerNotes, TrainerNotes.name, queryBuildCases.getAllTrainerNotes, req);
    return generalResponse(req, res, responseData, 'TRAINER_GETALL', false);
  });

  public addTrainerNotes = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.trainerRepository.createTrainerNotes(req);
    return generalResponse(req, res, responseData, 'TRAINER_NOTES_SUCCESS', true);
  });

  public deleteTrainerNotes = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.trainerRepository.deleteTrainerNotes(req);
    return generalResponse(req, res, responseData, 'TRAINER_NOTES_DELETED_SUCCESS', true);
  });
}
