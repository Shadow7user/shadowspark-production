'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function createTransaction(
  data: { amount: bigint; description: string; type: 'DEBIT' | 'CREDIT'; userId: string },
  tx?: Prisma.TransactionClient
) {
  const db = tx ?? prisma
  return await db.payment.create({
    data: {
      ...data,
      currency: 'NGN',
      provider: 'PAYSTACK',
      providerPaymentId: `internal-${data.userId}-${Date.now()}`,
    },
  })
}
