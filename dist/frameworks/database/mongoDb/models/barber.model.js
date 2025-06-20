"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberModel = void 0;
const mongoose_1 = require("mongoose");
const barber_schema_1 = require("../schemas/barber.schema");
exports.BarberModel = (0, mongoose_1.model)("Barber", barber_schema_1.barberSchema);
