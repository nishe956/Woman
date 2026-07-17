import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  host: 'aws-1-eu-west-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.rdvmeaksqorckiqbkzfy',
  password: 'XxgPLVuCW31mIDly',
  database: 'postgres',
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma