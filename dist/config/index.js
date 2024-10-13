"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARGON_SALT_LENGTH = exports.JWT_SECRET = exports.LOG_DIR = exports.LOG_FORMAT = exports.SERVER_URL = exports.FRONT_URL = exports.SECRET_KEY = exports.ENABLE_LOG = exports.PORT = exports.NODE_ENV = exports.DATABASE_URL = exports.CREDENTIALS = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const dotenv_2 = require("dotenv");
dotenv_1.default.config();
(0, dotenv_2.config)({ path: `.env.${process.env.NODE_ENV || 'development'}` });
exports.CREDENTIALS = process.env.CREDENTIALS === 'true';
_a = process.env, exports.DATABASE_URL = _a.DATABASE_URL, exports.NODE_ENV = _a.NODE_ENV, exports.PORT = _a.PORT, exports.ENABLE_LOG = _a.ENABLE_LOG, exports.SECRET_KEY = _a.SECRET_KEY, exports.FRONT_URL = _a.FRONT_URL, exports.SERVER_URL = _a.SERVER_URL, exports.LOG_FORMAT = _a.LOG_FORMAT, exports.LOG_DIR = _a.LOG_DIR, exports.JWT_SECRET = _a.JWT_SECRET, exports.ARGON_SALT_LENGTH = _a.ARGON_SALT_LENGTH;
//# sourceMappingURL=index.js.map