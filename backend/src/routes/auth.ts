import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prismaPkg from "@prisma/client";
const { Prisma } = prismaPkg;
import { prisma } from "../db/prisma";
import { env } from "../config/env";
import { authenticateToken } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimit";
import { validateBody } from "../middleware/validate";
import {
  registerBodySchema,
  loginBodySchema,
  type RegisterBody,
  type LoginBody,
} from "../validation/schemas";
import type {
  JwtPayload,
  LoginSuccessResponse,
  PublicUser,
  RegisterSuccessResponse,
  ApiErrorResponse,
} from "../types/auth";

const BCRYPT_ROUNDS = 12;

export const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  validateBody(registerBodySchema),
  async (
    req: Request<unknown, RegisterSuccessResponse | ApiErrorResponse, RegisterBody>,
    res: Response<RegisterSuccessResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const { email, password } = req.body;

    try {
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const user = await prisma.user.create({
        data: { email, passwordHash },
        select: { id: true },
      });
      res.status(201).json({
        message: "User registered successfully",
        userId: user.id,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({ error: "Email already exists" });
        return;
      }
      console.error("[register]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

authRouter.post(
  "/login",
  authLimiter,
  validateBody(loginBodySchema),
  async (
    req: Request<unknown, LoginSuccessResponse | ApiErrorResponse, LoginBody>,
    res: Response<LoginSuccessResponse | ApiErrorResponse>,
  ): Promise<void> => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, passwordHash: true },
      });

      if (user === null) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const payload: JwtPayload = { userId: user.id, email: user.email };
      const token = jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
      });

      const publicUser: PublicUser = { id: user.id, email: user.email };
      res.json({ message: "Login successful", token, user: publicUser });
    } catch (err) {
      console.error("[login]", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

authRouter.get(
  "/me",
  authenticateToken,
  async (
    req: Request,
    res: Response<PublicUser | ApiErrorResponse>,
  ): Promise<void> => {
    if (req.user === undefined) {
      res.status(401).json({ error: "Access denied" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true },
    });

    if (user === null) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  },
);
