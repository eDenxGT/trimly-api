import { model } from "mongoose";
import { refreshTokenSchema } from "../schemas/refresh-token.schema.js";
export const RefreshTokenModel = model("RefreshToken", refreshTokenSchema);
