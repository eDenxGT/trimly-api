"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairstyleModel = void 0;
const mongoose_1 = require("mongoose");
const hairstyle_schema_1 = require("../schemas/hairstyle.schema");
exports.HairstyleModel = (0, mongoose_1.model)("Hairstyle", hairstyle_schema_1.hairstyleSchema);
