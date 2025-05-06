import { model } from "mongoose";
import { serviceSchema } from "../schemas/service.schema.js";
export const ServiceModel = model("Service", serviceSchema);
