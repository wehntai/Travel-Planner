import path from "node:path";
import { PrismaClient } from "@prisma/client";

// The sqlite file: URL in DATABASE_URL is meant to be relative to the
// `prisma/` directory (matching how the Prisma CLI resolves it for
// migrate/seed). Next's bundlers don't always preserve that same base
// path at runtime, so resolve it to an absolute path ourselves.
const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const databaseUrl = rawUrl.startsWith("file:./")
  ? `file:${path.join(process.cwd(), "prisma", rawUrl.slice("file:./".length))}`
  : rawUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasources: { db: { url: databaseUrl } } });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
