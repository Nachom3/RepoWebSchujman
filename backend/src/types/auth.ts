export type JwtPayload = {
  userId: number;
  email: string;
};

export type AuthenticatedUser = JwtPayload;

export type PublicUser = {
  id: number;
  email: string;
};

export type LoginSuccessResponse = {
  message: string;
  token: string;
  user: PublicUser;
};

export type RegisterSuccessResponse = {
  message: string;
  userId: number;
};

export type ApiErrorResponse = {
  error: string;
  details?: unknown;
};

export const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.userId === "number" && typeof v.email === "string";
};
