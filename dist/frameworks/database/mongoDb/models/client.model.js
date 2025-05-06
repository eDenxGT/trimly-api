import { model } from "mongoose";
import { clientSchema } from "../schemas/client.schema.js";
export const ClientModel = model("Client", clientSchema);
