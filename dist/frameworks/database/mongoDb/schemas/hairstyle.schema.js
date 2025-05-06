import { Schema } from "mongoose";
export const hairstyleSchema = new Schema({
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
