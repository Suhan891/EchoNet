import z from "zod";

export const tokenSchema = z
  .string()
  .min(10, "Token is too Short")
  .regex(
    /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    "Invalid Token",
  );
