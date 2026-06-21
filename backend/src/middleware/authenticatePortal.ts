import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";

declare global {
  namespace Express {
    interface Request {
      portalClientId?: number;
    }
  }
}

export async function authenticatePortal(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.headers["x-portal-token"] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Portal session required" });
    return;
  }
  const session = await prisma.portalSession.findUnique({
    where: { token },
  });
  if (!session || session.expiresAt < new Date()) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }
  req.portalClientId = session.clientId;
  next();
}
