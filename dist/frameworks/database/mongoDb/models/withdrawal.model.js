"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalModel = void 0;
const mongoose_1 = require("mongoose");
const withdrawal_schema_1 = require("../schemas/withdrawal.schema");
exports.WithdrawalModel = (0, mongoose_1.model)("Withdrawal", withdrawal_schema_1.withdrawalSchema);
