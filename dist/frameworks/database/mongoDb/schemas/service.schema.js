"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.serviceSchema = new mongoose_1.Schema({
    serviceId: { type: String, required: true },
    barberId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active",
    },
    genderType: {
        type: String,
        enum: ["male", "female", "unisex"],
        required: true,
    },
    description: { type: String },
}, { timestamps: true });
