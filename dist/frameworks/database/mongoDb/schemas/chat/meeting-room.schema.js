"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingRoomSchema = void 0;
const mongoose_1 = require("mongoose");
exports.meetingRoomSchema = new mongoose_1.Schema({
    meetingId: { type: String, required: true },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    communityId: { type: String, required: true },
    scheduledBy: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    meetLink: {
        type: String,
    },
    status: {
        type: String,
        enum: ["scheduled", "cancelled", "completed"],
        default: "scheduled",
    },
}, { timestamps: true });
