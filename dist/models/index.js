"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSequelize = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@/utils/logger");
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("@/config");
const user_model_1 = tslib_1.__importDefault(require("./user.model"));
let db;
const initSequelize = () => {
    const sequelize = new sequelize_typescript_1.Sequelize(config_1.DATABASE_URL, {
        dialect: 'postgres',
        logging: +config_1.ENABLE_LOG === 1 && logger_1.logger.info.bind(null, '\n%s'),
        dialectOptions: { application_name: `MySchool - ${config_1.NODE_ENV}` },
    });
    sequelize.addModels([user_model_1.default]);
    return sequelize;
};
exports.initSequelize = initSequelize;
if (!db) {
    db = (0, exports.initSequelize)();
}
exports.default = db;
//# sourceMappingURL=index.js.map