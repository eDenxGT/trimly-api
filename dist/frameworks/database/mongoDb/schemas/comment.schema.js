"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentSchema = new mongoose_1.Schema({
    commentId: { type: String, required: true, unique: true },
    postId: { type: String, required: true, ref: "Post" },
    userId: { type: String, required: true },
    commentText: { type: String, required: true },
    likes: [{ type: String }],
}, { timestamps: true });
exports.commentSchema.index({ postId: 1 });
exports.commentSchema.index({ userId: 1 });
exports.commentSchema.index({ likes: 1 });
exports.commentSchema.index({ createdAt: -1 });
