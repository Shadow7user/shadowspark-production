import { PrismaClient } from "@prisma/client"
import { loadCloudSecrets } from "@/lib/vault"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaInitPromise: Promise<void> | undefined
}

const prismaInitPromise =
  globalForPrisma.prismaInitPromise ??
  loadCloudSecrets()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaInitPromise = prismaInitPromise
}

await prismaInitPromise

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['error', 'warn']
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
