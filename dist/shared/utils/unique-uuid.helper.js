"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const uuid_1 = require("uuid");
const generateUniqueId = (prefix = "user") => {
    return `trimly-${prefix}-${(0, uuid_1.v4)().slice(10)}`;
};
exports.generateUniqueId = generateUniqueId;
