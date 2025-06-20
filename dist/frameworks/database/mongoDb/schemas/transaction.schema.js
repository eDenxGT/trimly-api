"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.transactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    walletId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
    },
    source: {
        type: String,
        enum: ["booking", "topup", "withdrawal", "refund"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },
    referenceId: {
        type: String,
    },
}, {
    timestamps: true,
});
