// @ts-nocheck
// Prisma 7 config - types not yet stable
import path from 'node:path'
import { defineConfig } from 'prisma'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve('.env.local') })

export default defineConfig({
  migrations: {
    connectionString: process.env.DIRECT_URL!,
  },
})
