import { config } from "../../shared/config.js";
import bcrypt from "bcryptjs";
export class OtpBcrypt {
    async hash(original) {
        return bcrypt.hash(original, config.bcryptSaltRounds);
    }
    async compare(current, original) {
        return bcrypt.compare(current, original);
    }
}
