"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const models_1 = tslib_1.__importDefault(require("./models"));
const config_1 = require("./config");
const port = config_1.PORT || 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const main = async () => {
    try {
        await models_1.default.authenticate();
    }
    catch (err) {
        logger_1.logger.error('[SERVER START]: %s', err);
        process.exit(1);
    }
};
main();
//# sourceMappingURL=server.js.map