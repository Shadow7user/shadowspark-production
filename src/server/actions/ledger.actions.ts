"use server";

import { prisma } from "@/lib/prisma";

export async function createTransaction(data: {
  amount: number;
  description: string;
}) {
  return await prisma.payment.create({
    data: {
      ...data,
      currency: "NGN",
      provider: "paystack",
    },
  });
}
