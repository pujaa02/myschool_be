import { Sequelize } from 'sequelize-typescript';
import User from './user.model';
import { DATABASE_URL, ENABLE_LOG, NODE_ENV } from '../config';
import { logger } from '../utils/logger';
import CellMember from './cellMember.model';
import Class from './class.model';
import Committe from './committe.model';
import Exam from './exam.model';
import ExamResults from './examResult.model';
import Leave from './leave.model';
import Sensation from './sensation.model';
import SensationComment from './sensationComment.model';
import SensationLike from './sensationLike.model';
import Student from './student.model';
import StudentAttendance from './studentAttendance.model';
import Subject from './subject.model';
import Role from './role.model';
import RolePermission from './rolesPermissions.model';
import Permission from './permission.model';
import PermissionGroup from './permissionGroup.model';
import UserRole from './userRole.model';

let db: Sequelize;

export const initSequelize = () => {
  const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: +ENABLE_LOG === 1 && logger.info.bind(null, '\n%s'),
    dialectOptions: { application_name: `MySchool - ${NODE_ENV}` },
  });
  sequelize.addModels([
    User,
    CellMember,
    Class,
    Committe,
    Exam,
    ExamResults,
    Leave,
    Sensation,
    SensationComment,
    SensationLike,
    Student,
    StudentAttendance,
    Subject,
    UserRole,
    Role,
    RolePermission,
    Permission,
    PermissionGroup,
  ]);

  return sequelize;
};

if (!db) {
  db = initSequelize();
}

export default db;
