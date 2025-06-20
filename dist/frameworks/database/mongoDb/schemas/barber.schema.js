"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barberSchema = void 0;
const mongoose_1 = require("mongoose");
exports.barberSchema = new mongoose_1.Schema({
    userId: { type: String, unique: true },
    shopName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "barber" },
    avatar: { type: String },
    banner: { type: String },
    status: {
        type: String,
        enum: ["active", "blocked", "pending"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
        default: "Complete your full profile by adding your shop details, at least one service, and setting your opening hours. For any queries, contact support at contact@trimly.in",
    },
    description: { type: String },
    googleId: { type: String },
    openingHours: {
        monday: { type: Object, default: null },
        tuesday: { type: Object, default: null },
        wednesday: { type: Object, default: null },
        thursday: { type: Object, default: null },
        friday: { type: Object, default: null },
        saturday: { type: Object, default: null },
        sunday: { type: Object, default: null },
    },
    amenities: {
        wifi: { type: Boolean },
        parking: { type: Boolean },
    },
    card_details: {
        card_number: {
            type: String,
        },
        owner_name: {
            type: String,
        },
        expiry_date: {
            type: String,
        },
        cvv: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    walletBalance: { type: Number, default: 0 },
    totalRevenue: {
        type: Number,
        default: 0,
    },
    withdrawnAmount: {
        type: Number,
        default: 0,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
        name: { type: String },
        displayName: { type: String },
        zipCode: { type: String },
    },
}, { timestamps: true });
exports.barberSchema.index({ location: "2dsphere" });
