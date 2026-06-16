import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";

const adapter = new PrismaBetterSqlite3({
	url: env.DATABASE_URL ?? "file:./dev.db"
});

/** @type {typeof globalThis & { prisma?: PrismaClient }} */
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (dev) {
	globalForPrisma.prisma = prisma;
}
