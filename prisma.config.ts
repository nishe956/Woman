import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = "postgresql://postgres.rdvmeaksqorckiqbkzfy:W0men%40SESS1ON2026@aws-1-eu-west-2.pooler.supabase.com:5432/postgres"
export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: connectionString,
  },
  migrate: {
    async adapter() {
      return new PrismaPg({ connectionString })
    },
  },
})