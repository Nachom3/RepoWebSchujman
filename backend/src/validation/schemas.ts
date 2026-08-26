import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password too long")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

export const loginBodySchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
