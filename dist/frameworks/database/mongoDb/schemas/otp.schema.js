import { Schema } from "mongoose";
export const otpSchema = new Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 60,
    },
}, { timestamps: true });
