"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const date_fns_1 = require("date-fns");
const formatDate = (date) => {
    return (0, date_fns_1.format)(new Date(date), "MMMM d, yyyy");
};
exports.formatDate = formatDate;
