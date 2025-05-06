import { Schema } from "mongoose";
export const refreshTokenSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ["admin", "client", "barber"],
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 604800, // 7 days in scnds
    },
});
