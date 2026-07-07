import { PrismaClient } from "@prisma/client";

// Prevents creating a new Prisma Client on every hot-reload in dev,
// and reuses one connection per serverless function on Vercel.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
