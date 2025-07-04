import { z } from "zod";
import { passwordSchema } from "../../../../shared/validations/password.validation";
import { ERROR_MESSAGES } from "../../../../shared/constants";

export const resetPasswordValidationSchema = z.object({
	password: passwordSchema,
	token: z.string(),
	role: z.enum(["client", "admin", "barber"], {
		message: ERROR_MESSAGES.INVALID_ROLE,
	}),
});
