import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// ✅ Reuse in both dev AND production on serverless
globalThis.prisma = prisma;

export default prisma;