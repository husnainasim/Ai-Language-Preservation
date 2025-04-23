import { PrismaClient } from "@prisma/client";

// Reset the global Prisma client
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export { db };

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
