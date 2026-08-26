import { z } from "zod";

const emailField = z
  .string()
  .min(1, "El email es obligatorio")
  .email("Email inválido");

const passwordField = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: emailField,
  password: passwordField
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
