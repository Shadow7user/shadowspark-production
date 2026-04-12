"use client";
export const dynamic = "force-dynamic";


import CheckoutClient from "./CheckoutClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CheckoutPage({ params }: { params: { leadId: string } }) {
  // await connection();
  // Using empty dummy check here since no DB
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <CheckoutClient leadId={params.leadId} />
    </div>
  );
}
