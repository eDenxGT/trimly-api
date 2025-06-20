"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalSchema = void 0;
const mongoose_1 = require("mongoose");
exports.withdrawalSchema = new mongoose_1.Schema({
    withdrawalId: { type: String, required: true },
    walletId: { type: String, required: true },
    userId: { type: String, required: true },
    userType: {
        type: String,
        enum: ["client", "barber"],
        required: true,
    },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    method: {
        type: String,
        enum: ["upi", "bank"],
        required: true,
    },
    // UPI
    upiId: { type: String },
    // Bank Transfer
    accountHolderName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    remarks: { type: String },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
}, { timestamps: true });
