import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation";
import { ERROR_MESSAGES } from "../../../../shared/constants";

export const forgotPasswordValidationSchema = z.object({
	email: strongEmailRegex,
	role: z.enum(["client", "admin", "barber"], {
		message: ERROR_MESSAGES.INVALID_ROLE,
	}),
});
