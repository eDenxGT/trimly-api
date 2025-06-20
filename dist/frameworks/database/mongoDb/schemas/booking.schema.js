"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.bookingSchema = new mongoose_1.Schema({
    bookingId: {
        type: String,
        required: true,
    },
    shopId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
    },
    clientId: {
        type: String,
        required: true,
    },
    services: {
        type: [String],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    bookedTimeSlots: {
        type: [String],
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
}, {
    timestamps: true,
});
exports.bookingSchema.index({ shopId: 1, date: 1, startTime: 1 }, {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } },
    name: "unique_booking_slot_index",
});
