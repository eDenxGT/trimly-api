"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairstyleSchema = void 0;
const mongoose_1 = require("mongoose");
exports.hairstyleSchema = new mongoose_1.Schema({
    hairstyleId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    faceShapes: {
        type: [String],
        required: true,
    },
}, {
    timestamps: true,
});
