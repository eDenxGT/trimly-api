"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityChatRoomSchema = void 0;
const mongoose_1 = require("mongoose");
exports.communityChatRoomSchema = new mongoose_1.Schema({
    communityId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    members: [
        {
            type: String,
            ref: "Barber",
            required: true,
        },
    ],
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
    },
    createdBy: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
