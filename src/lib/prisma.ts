import "server-only";

import { PrismaClient } from "@prisma/client";

// Dev/HMR tạo lại module mỗi lần save; không có singleton thì sau ~20 lần lưu là cạn
// connection pool của Postgres.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
