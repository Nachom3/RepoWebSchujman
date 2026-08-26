import { Router, type Request, type Response } from "express";
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
  LoginSuccessResponse,
  PublicUser,
  RegisterSuccessResponse,
  ApiErrorResponse,
} from "../types/auth";
import {
  GetCurrentUserUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
} from "../features/auth/application/authUseCases";
import { PrismaAuthRepository } from "../features/auth/infrastructure/prismaAuthRepository";

export const authRouter = Router();

const authRepository = new PrismaAuthRepository();
const registerUserUseCase = new RegisterUserUseCase(authRepository);
const loginUserUseCase = new LoginUserUseCase(authRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);

authRouter.post(
  "/register",
  authLimiter,
  validateBody(registerBodySchema),
  async (
    req: Request<unknown, RegisterSuccessResponse | ApiErrorResponse, RegisterBody>,
    res: Response<RegisterSuccessResponse | ApiErrorResponse>,
  ): Promise<void> => {
    try {
      const result = await registerUserUseCase.execute(req.body);
      if (result.kind === "email-exists") {
        res.status(409).json({ error: "Email already exists" });
        return;
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: result.userId,
      });
    } catch (err) {
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
    try {
      const result = await loginUserUseCase.execute(req.body);
      if (result.kind === "invalid-credentials") {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.json({
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
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

    const result = await getCurrentUserUseCase.execute(req.user.userId);
    if (result.kind === "not-found") {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(result.user);
  },
);
