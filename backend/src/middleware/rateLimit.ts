import rateLimit from "express-rate-limit";
import type { Request } from "express";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
  // Key on the actual TCP peer address, never the client-controllable
  // X-Forwarded-For header, so rotating that header cannot bypass the limit.
  keyGenerator: (req: Request) => req.socket.remoteAddress ?? "unknown",
});
