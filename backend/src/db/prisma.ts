import pkg from "@prisma/client";
const { PrismaClient } = pkg;

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error", "warn"],
});

export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};
