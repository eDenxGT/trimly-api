"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
exports.postSchema = new mongoose_1.Schema({
    postId: { type: String, required: true, unique: true },
    barberId: { type: String, required: true },
    caption: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    likes: [{ type: String }],
    status: { type: String, enum: ["active", "blocked"], default: "active" },
}, { timestamps: true });
exports.postSchema.index({ likes: 1 });
exports.postSchema.index({ barberId: 1 });
exports.postSchema.index({ status: 1 });
