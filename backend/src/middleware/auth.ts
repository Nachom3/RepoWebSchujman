import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { isJwtPayload } from "../types/auth";

export const authenticateToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  if (token === undefined || token === "") {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  jwt.verify(token, env.jwtSecret, (err, decoded) => {
    if (err !== null || !isJwtPayload(decoded)) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    req.user = decoded;
    next();
  });
};
