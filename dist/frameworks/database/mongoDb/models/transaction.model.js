"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const transaction_schema_1 = require("../schemas/transaction.schema");
exports.TransactionModel = (0, mongoose_1.model)("Transaction", transaction_schema_1.transactionSchema);
