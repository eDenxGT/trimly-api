"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorResponse = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
const custom_error_1 = require("../../entities/utils/custom.error");
const chalk_1 = __importDefault(require("chalk"));
const error_logger_1 = __importDefault(require("./error.logger"));
const handleErrorResponse = (req, res, error) => {
    error_logger_1.default.error(`[${req.method}] ${req.url} - ${error.message}`, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        stack: error.stack,
    });
    if (error instanceof zod_1.ZodError) {
        console.error(chalk_1.default.bgRedBright(error.name), ": ", error);
        const errors = error.errors.map((err) => ({
            message: err.message,
        }));
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
            errors,
        });
    }
    if (error instanceof custom_error_1.CustomError) {
        console.error(chalk_1.default.bgRedBright(error.name), ": ", error);
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    if (error instanceof Error) {
        console.error(chalk_1.default.bgRedBright(error.name), ": ", error);
    }
    else {
        console.error(chalk_1.default.bgRedBright("Unknown Error: "), error);
    }
    return res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
    });
};
exports.handleErrorResponse = handleErrorResponse;
