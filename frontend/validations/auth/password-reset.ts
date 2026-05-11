import * as z from "zod";

export const startResetSchema = z.object({
  email: z.email("Please provide a valid email"),
});
export type startResetType = z.infer<typeof startResetSchema>;

export const tokenSchema = z
  .string()
  .min(10, "Token is too Short")
  .regex(
    /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    "Invalid Token",
  );
export type TokenType = z.infer<typeof tokenSchema>
export const VerifyOtpSchema = z.object({
  token: tokenSchema,
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
export type VerifyOtpType = z.infer<typeof VerifyOtpSchema>;

export const updatePasswordSchema = z.object({
  token: tokenSchema,
  password: z
    .string()
    .min(2, "Password must be at least 2 characters.")
    .max(200, "Password must be at most 200 characters."),
});
export type upPassType = z.infer<typeof updatePasswordSchema>;
