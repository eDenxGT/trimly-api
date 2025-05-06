import { model } from "mongoose";
import { barberSchema } from "../schemas/barber.schema.js";
export const BarberModel = model("Barber", barberSchema);
