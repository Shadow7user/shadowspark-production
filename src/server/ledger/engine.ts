
import { prisma } from '@/lib/prisma';
import { LedgerAccountType, EntryDirection } from '@prisma/client';
import { z } from 'zod';

const CreateTransactionInput = z.object({
  description: z.string(),
  idempotencyKey: z.string().uuid(),
  entries: z.array(z.object({
    ledgerAccountId: z.string(),
    direction: z.nativeEnum(EntryDirection),
    amount: z.bigint().positive(),
  })).min(2),
});

export type CreateTransactionPayload = z.infer<typeof CreateTransactionInput>;

/**
 * Creates a new financial transaction in an atomic way.
 * Ensures that the sum of debits equals the sum of credits.
 *
 * @param payload - The transaction details, including entries.
 * @returns The newly created transaction.
 */
export async function createTransaction(payload: CreateTransactionPayload) {
  const { description, idempotencyKey, entries } = CreateTransactionInput.parse(payload);

  // 1. Validate that the transaction is balanced
  const total = entries.reduce((acc, entry) => {
    const amount = entry.direction === 'DEBIT' ? entry.amount : -entry.amount;
    return acc + amount;
  }, 0n);

  if (total !== 0n) {
    throw new Error('Transaction is unbalanced. The sum of debits must equal the sum of credits.');
  }

  // 2. Execute as an atomic database transaction
  return prisma.$transaction(async (tx) => {
    // First, check for idempotency to prevent duplicate operations
    const existingTransaction = await tx.transaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTransaction) {
      console.warn(`Idempotency key ${idempotencyKey} has already been processed.`);
      return existingTransaction;
    }

    // Create the parent transaction record
    const transaction = await tx.transaction.create({
      data: {
        description,
        idempotencyKey,
      },
    });

    // Create the individual ledger entries
    await tx.ledgerEntry.createMany({
      data: entries.map(entry => ({
        transactionId: transaction.id,
        ledgerAccountId: entry.ledgerAccountId,
        direction: entry.direction,
        amount: entry.amount,
      })),
    });

    return transaction;
  });
}

/**
 * A high-level helper to credit an account.
 * This is a DEBIT to an asset account (increasing its balance) and a CREDIT to the source.
 *
 * @param fromLedgerId - The source ledger account to take funds from.
 * @param toLedgerId - The destination asset ledger account.
 * @param amount - The amount to transfer.
 * @param description - A description of the transaction.
 * @param idempotencyKey - A unique key for the transaction.
 */
export async function creditAccount(
  fromLedgerId: string,
  toLedgerId: string,
  amount: bigint,
  description: string,
  idempotencyKey: string
) {
  return createTransaction({
    description,
    idempotencyKey,
    entries: [
      { ledgerAccountId: fromLedgerId, direction: 'CREDIT', amount },
      { ledgerAccountId: toLedgerId, direction: 'DEBIT', amount },
    ],
  });
}

/**
 * A high-level helper to debit an account.
 * This is a CREDIT to an asset account (decreasing its balance) and a DEBIT to the destination.
 *
 * @param fromLedgerId - The source asset ledger account.
 * @param toLedgerId - The destination ledger account.
 * @param amount - The amount to transfer.
 * @param description - A description of the transaction.
 * @param idempotencyKey - A unique key for the transaction.
 */
export async function debitAccount(
  fromLedgerId: string,
  toLedgerId: string,
  amount: bigint,
  description: string,
  idempotencyKey: string
) {
  return createTransaction({
    description,
    idempotencyKey,
    entries: [
      { ledgerAccountId: fromLedgerId, direction: 'CREDIT', amount },
      { ledgerAccountId: toLedgerId, direction: 'DEBIT', amount },
    ],
  });
}

/**
 * Calculates the current balance of a ledger account.
 * It does so by summing all credit and debit entries for that account.
 * 
 * NOTE: In a high-traffic system, this result should be cached (e.g., in Redis)
 * and updated/invalidated via event-driven hooks after a transaction completes.
 * For simplicity, we are calculating it directly here.
 *
 * @param ledgerAccountId - The ID of the ledger account.
 * @returns The calculated balance as a BigInt.
 */
export async function getAccountBalance(ledgerAccountId: string): Promise<bigint> {
  const { _sum: credits } = await prisma.ledgerEntry.aggregate({
    _sum: { amount: true },
    where: { ledgerAccountId, direction: 'CREDIT' },
  });

  const { _sum: debits } = await prisma.ledgerEntry.aggregate({
    _sum: { amount: true },
    where: { ledgerAccountId, direction: 'DEBIT' },
  });

  const creditAmount = credits.amount || 0n;
  const debitAmount = debits.amount || 0n;

  // For asset accounts (like user wallets), the balance is Debits - Credits.
  // This logic can be enhanced based on the account type (ASSET, LIABILITY, etc.)
  // For now, we assume we are primarily dealing with asset accounts.
  return debitAmount - creditAmount;
}
