"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const review_schema_1 = require("../schemas/review.schema");
exports.ReviewModel = (0, mongoose_1.model)("Review", review_schema_1.reviewSchema);
