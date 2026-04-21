import z from "zod";

const tokenSchema = z
  .string()
  .min(10, "Token is too Short")
  .regex(
    /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    "Invalid Token",
  );
