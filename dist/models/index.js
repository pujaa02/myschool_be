"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSequelize = void 0;
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = tslib_1.__importDefault(require("./user.model"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const cellMember_model_1 = tslib_1.__importDefault(require("./cellMember.model"));
const class_model_1 = tslib_1.__importDefault(require("./class.model"));
const committe_model_1 = tslib_1.__importDefault(require("./committe.model"));
const exam_model_1 = tslib_1.__importDefault(require("./exam.model"));
const examResult_model_1 = tslib_1.__importDefault(require("./examResult.model"));
const leave_model_1 = tslib_1.__importDefault(require("./leave.model"));
const sensation_model_1 = tslib_1.__importDefault(require("./sensation.model"));
const sensationComment_model_1 = tslib_1.__importDefault(require("./sensationComment.model"));
const sensationLike_model_1 = tslib_1.__importDefault(require("./sensationLike.model"));
const student_model_1 = tslib_1.__importDefault(require("./student.model"));
const studentAttendance_model_1 = tslib_1.__importDefault(require("./studentAttendance.model"));
const subject_model_1 = tslib_1.__importDefault(require("./subject.model"));
const role_model_1 = tslib_1.__importDefault(require("./role.model"));
const rolesPermissions_model_1 = tslib_1.__importDefault(require("./rolesPermissions.model"));
const permission_model_1 = tslib_1.__importDefault(require("./permission.model"));
const permissionGroup_model_1 = tslib_1.__importDefault(require("./permissionGroup.model"));
const userRole_model_1 = tslib_1.__importDefault(require("./userRole.model"));
let db;
const initSequelize = () => {
    const sequelize = new sequelize_typescript_1.Sequelize(config_1.DATABASE_URL, {
        dialect: 'postgres',
        logging: +config_1.ENABLE_LOG === 1 && logger_1.logger.info.bind(null, '\n%s'),
        dialectOptions: { application_name: `MySchool - ${config_1.NODE_ENV}` },
    });
    sequelize.addModels([
        user_model_1.default,
        cellMember_model_1.default,
        class_model_1.default,
        committe_model_1.default,
        exam_model_1.default,
        examResult_model_1.default,
        leave_model_1.default,
        sensation_model_1.default,
        sensationComment_model_1.default,
        sensationLike_model_1.default,
        student_model_1.default,
        studentAttendance_model_1.default,
        subject_model_1.default,
        userRole_model_1.default,
        role_model_1.default,
        rolesPermissions_model_1.default,
        permission_model_1.default,
        permissionGroup_model_1.default,
    ]);
    return sequelize;
};
exports.initSequelize = initSequelize;
if (!db) {
    db = (0, exports.initSequelize)();
}
exports.default = db;
//# sourceMappingURL=index.js.map