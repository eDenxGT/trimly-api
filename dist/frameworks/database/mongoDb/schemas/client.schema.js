import { Schema } from "mongoose";
export const clientSchema = new Schema({
    userId: { type: String, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "client" },
    password: { type: String, required: true },
    avatar: { type: String },
    phoneNumber: { type: String },
    walletBalance: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["active", "blocked", "pending"],
        default: "active",
    },
    googleId: { type: String },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            // default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        },
        name: { type: String },
        displayName: { type: String },
        zipCode: { type: String },
    },
}, { timestamps: true });
clientSchema.index({ location: "2dsphere" });
