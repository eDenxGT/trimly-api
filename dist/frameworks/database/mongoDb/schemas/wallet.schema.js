"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletSchema = void 0;
const mongoose_1 = require("mongoose");
exports.walletSchema = new mongoose_1.Schema({
    walletId: { type: String, required: true },
    ownerId: { type: String, required: true },
    ownerType: { type: String, enum: ["barber", "client"], required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
}, {
    timestamps: true,
});
