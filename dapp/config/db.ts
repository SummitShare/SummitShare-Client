import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Singleton function to create an extended PrismaClient with Accelerate
const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Check if an existing Prisma client is available; otherwise, initialize one
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// Assign Prisma client to global object in non-development environments
if (process.env.NODE_ENV !== 'development') globalForPrisma.prisma = prisma;
