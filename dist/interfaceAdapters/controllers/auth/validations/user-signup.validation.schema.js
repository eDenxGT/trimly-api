"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemas = void 0;
const zod_1 = require("zod");
const email_validation_1 = require("../../../../shared/validations/email.validation");
const password_validation_1 = require("../../../../shared/validations/password.validation");
const name_validation_1 = require("../../../../shared/validations/name.validation");
const phone_validation_1 = require("../../../../shared/validations/phone.validation");
const adminSchema = zod_1.z.object({
    email: email_validation_1.strongEmailRegex,
    password: password_validation_1.passwordSchema,
    role: zod_1.z.literal("admin"),
});
const clientSchema = zod_1.z.object({
    fullName: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phoneNumber: phone_validation_1.phoneNumberSchema,
    password: password_validation_1.passwordSchema,
    role: zod_1.z.literal("client"),
});
const barberSchema = zod_1.z.object({
    shopName: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phoneNumber: phone_validation_1.phoneNumberSchema,
    password: password_validation_1.passwordSchema,
    location: zod_1.z.object({
        name: zod_1.z.string(),
        displayName: zod_1.z.string(),
        zipCode: zod_1.z.string(),
    }),
    geoLocation: zod_1.z.object({
        type: zod_1.z.string(),
        coordinates: zod_1.z
            .tuple([
            zod_1.z.number().min(-180).max(180), // longitude
            zod_1.z.number().min(-90).max(90), // latitude
        ])
            .refine((coords) => coords.length === 2, "Coordinates must be [longitude, latitude]"),
    }),
    status: zod_1.z.enum(["pending", "active", "blocked"]),
    role: zod_1.z.literal("barber"),
});
exports.userSchemas = {
    admin: adminSchema,
    client: clientSchema,
    barber: barberSchema,
};
