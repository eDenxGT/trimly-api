"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidationSchema = void 0;
const zod_1 = require("zod");
const password_validation_1 = require("../../../../shared/validations/password.validation");
const constants_1 = require("../../../../shared/constants");
exports.resetPasswordValidationSchema = zod_1.z.object({
    password: password_validation_1.passwordSchema,
    token: zod_1.z.string(),
    role: zod_1.z.enum(["client", "admin", "barber"], {
        message: constants_1.ERROR_MESSAGES.INVALID_ROLE,
    }),
});
