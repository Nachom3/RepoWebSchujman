import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import type { JwtPayload, PublicUser } from "../../../types/auth";

const BCRYPT_ROUNDS = 12;

export type AuthUserWithPassword = PublicUser & {
  passwordHash: string;
};

export type AuthUserRepository = {
  createUser(input: { email: string; passwordHash: string }): Promise<PublicUser>;
  findByEmail(email: string): Promise<AuthUserWithPassword | null>;
  findPublicById(id: number): Promise<PublicUser | null>;
};

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email already exists");
  }
}

export type RegisterUserResult =
  | { kind: "registered"; userId: number }
  | { kind: "email-exists" };

export class RegisterUserUseCase {
  constructor(private readonly users: AuthUserRepository) {}

  async execute(input: { email: string; password: string }): Promise<RegisterUserResult> {
    try {
      const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
      const user = await this.users.createUser({ email: input.email, passwordHash });

      return {
        kind: "registered",
        userId: user.id,
      };
    } catch (err) {
      if (err instanceof DuplicateEmailError) {
        return { kind: "email-exists" };
      }
      throw err;
    }
  }
}

export type LoginUserResult =
  | { kind: "authenticated"; token: string; user: PublicUser }
  | { kind: "invalid-credentials" };

export class LoginUserUseCase {
  constructor(private readonly users: AuthUserRepository) {}

  async execute(input: { email: string; password: string }): Promise<LoginUserResult> {
    const user = await this.users.findByEmail(input.email);
    if (user === null) {
      return { kind: "invalid-credentials" };
    }

    const match = await bcrypt.compare(input.password, user.passwordHash);
    if (!match) {
      return { kind: "invalid-credentials" };
    }

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, env.jwtSecret, {
      algorithm: "HS256",
      expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    });

    return {
      kind: "authenticated",
      token,
      user: { id: user.id, email: user.email },
    };
  }
}

export type GetCurrentUserResult =
  | { kind: "found"; user: PublicUser }
  | { kind: "not-found" };

export class GetCurrentUserUseCase {
  constructor(private readonly users: AuthUserRepository) {}

  async execute(userId: number): Promise<GetCurrentUserResult> {
    const user = await this.users.findPublicById(userId);
    if (user === null) {
      return { kind: "not-found" };
    }

    return { kind: "found", user };
  }
}
