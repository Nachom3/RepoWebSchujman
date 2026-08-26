import prismaPkg, { UserRole } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import {
  DuplicateEmailError,
  type AuthUserRepository,
  type AuthUserWithPassword,
} from "../application/authUseCases";
import type { PublicUser } from "../../../types/auth";

const { Prisma } = prismaPkg;

export class PrismaAuthRepository implements AuthUserRepository {
  async createUser(input: { email: string; passwordHash: string }): Promise<PublicUser> {
    try {
      return await prisma.user.create({
        data: { ...input, role: UserRole.OPERADOR },
        select: { id: true, email: true },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new DuplicateEmailError();
      }
      throw err;
    }
  }

  async findByEmail(email: string): Promise<AuthUserWithPassword | null> {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    });
  }

  async findPublicById(id: number): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
  }
}
