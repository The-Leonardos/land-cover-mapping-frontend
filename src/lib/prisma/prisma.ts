// This creates only one instance of prisma client known as global object
// to minimize hot reloading on application
// read this guide: https://www.prisma.io/docs/guides/nextjs

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
