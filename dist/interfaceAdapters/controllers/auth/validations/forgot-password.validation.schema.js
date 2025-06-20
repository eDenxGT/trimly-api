"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordValidationSchema = void 0;
const zod_1 = require("zod");
const email_validation_1 = require("../../../../shared/validations/email.validation");
const constants_1 = require("../../../../shared/constants");
exports.forgotPasswordValidationSchema = zod_1.z.object({
    email: email_validation_1.strongEmailRegex,
    role: zod_1.z.enum(["client", "admin", "barber"], {
        message: constants_1.ERROR_MESSAGES.INVALID_ROLE,
    }),
});
