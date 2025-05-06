import { model } from "mongoose";
import { otpSchema } from "../schemas/otp.schema.js";
export const OtpModel = model("Otp", otpSchema);
