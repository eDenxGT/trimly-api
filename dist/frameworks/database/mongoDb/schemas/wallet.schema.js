import { Schema } from "mongoose";
export const walletSchema = new Schema({
    walletId: { type: String, required: true },
    ownerId: { type: String, required: true },
    ownerType: { type: String, enum: ["barber", "client"], required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
}, {
    timestamps: true,
});
