"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSchema = void 0;
const mongoose_1 = require("mongoose");
exports.clientSchema = new mongoose_1.Schema({
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
    geoLocation: {
        type: {
            type: String,
            enum: ["Point"],
            // default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        },
    },
    location: {
        name: { type: String },
        displayName: { type: String },
        zipCode: { type: String },
    },
}, { timestamps: true });
exports.clientSchema.index({ geoLocation: "2dsphere" });
